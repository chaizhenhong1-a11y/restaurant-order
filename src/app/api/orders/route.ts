import { NextResponse } from "next/server";
import type {
  CreateOrderLineInput,
  CreateOrderRequest
} from "@/features/orders/types/order-api";
import { createOrderNumber } from "@/lib/orders/order-number";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function isLineInput(value: unknown): value is CreateOrderLineInput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const line = value as Record<string, unknown>;

  return (
    typeof line.menuItemId === "string" &&
    Number.isInteger(line.quantity) &&
    Number(line.quantity) > 0 &&
    Number(line.quantity) <= 99 &&
    typeof line.note === "string" &&
    Array.isArray(line.selections) &&
    line.selections.every(
      (selection) =>
        !!selection &&
        typeof selection === "object" &&
        typeof (selection as Record<string, unknown>).choiceId === "string"
    )
  );
}

function isCreateOrderRequest(value: unknown): value is CreateOrderRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    typeof body.restaurantSlug === "string" &&
    body.restaurantSlug.length > 0 &&
    typeof body.tableCode === "string" &&
    body.tableCode.length > 0 &&
    body.tableCode.length <= 20 &&
    typeof body.dinerName === "string" &&
    body.dinerName.length <= 40 &&
    typeof body.orderNote === "string" &&
    body.orderNote.length <= 200 &&
    Array.isArray(body.lines) &&
    body.lines.length > 0 &&
    body.lines.length <= 50 &&
    body.lines.every(isLineInput)
  );
}

export async function POST(request: Request) {
  try {
    const rawBody: unknown = await request.json();

    if (!isCreateOrderRequest(rawBody)) {
      return NextResponse.json(
        {
          error: "INVALID_ORDER",
          message: "The submitted order is invalid."
        },
        { status: 400 }
      );
    }

    const body = rawBody;
    const tableCode = body.tableCode.trim().toUpperCase();

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug: body.restaurantSlug
      },
      select: {
        id: true,
        isOpen: true,
        tables: {
          where: {
            code: tableCode
          },
          select: {
            id: true,
            status: true
          },
          take: 1
        }
      }
    });

    if (!restaurant) {
      return NextResponse.json(
        {
          error: "RESTAURANT_NOT_FOUND",
          message: "Restaurant not found."
        },
        { status: 404 }
      );
    }

    if (!restaurant.isOpen) {
      return NextResponse.json(
        {
          error: "RESTAURANT_CLOSED",
          message: "The restaurant is currently closed."
        },
        { status: 409 }
      );
    }

    const table = restaurant.tables[0];

    if (!table || table.status === "DISABLED") {
      return NextResponse.json(
        {
          error: "INVALID_TABLE",
          message: "This table is not available for ordering."
        },
        { status: 400 }
      );
    }

    const uniqueMenuItemIds = [
      ...new Set(body.lines.map((line) => line.menuItemId))
    ];

    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: {
          in: uniqueMenuItemIds
        },
        restaurantId: restaurant.id,
        isAvailable: true
      },
      include: {
        optionGroups: {
          include: {
            choices: true
          }
        }
      }
    });

    const menuItemMap = new Map(
      menuItems.map((menuItem) => [menuItem.id, menuItem])
    );

    if (menuItemMap.size !== uniqueMenuItemIds.length) {
      return NextResponse.json(
        {
          error: "MENU_ITEM_UNAVAILABLE",
          message: "One or more dishes are no longer available."
        },
        { status: 409 }
      );
    }

    const preparedLines = [];

    for (const line of body.lines) {
      const menuItem = menuItemMap.get(line.menuItemId);

      if (!menuItem) {
        return NextResponse.json(
          {
            error: "MENU_ITEM_UNAVAILABLE",
            message: "One or more dishes are no longer available."
          },
          { status: 409 }
        );
      }

      const requestedChoiceIds = [
        ...new Set(line.selections.map((selection) => selection.choiceId))
      ];

      const groupsByChoiceId = new Map<
        string,
        {
          groupId: string;
          groupLabel: string;
          multiple: boolean;
          choiceLabel: string;
          priceDelta: number;
        }
      >();

      for (const group of menuItem.optionGroups) {
        for (const choice of group.choices) {
          groupsByChoiceId.set(choice.id, {
            groupId: group.id,
            groupLabel: group.label,
            multiple: group.multiple,
            choiceLabel: choice.label,
            priceDelta: Number(choice.priceDelta)
          });
        }
      }

      const selectedSnapshots = [];
      const selectedCountByGroup = new Map<string, number>();

      for (const choiceId of requestedChoiceIds) {
        const choice = groupsByChoiceId.get(choiceId);

        if (!choice) {
          return NextResponse.json(
            {
              error: "INVALID_CUSTOMISATION",
              message: `Invalid option selected for ${menuItem.name}.`
            },
            { status: 400 }
          );
        }

        selectedCountByGroup.set(
          choice.groupId,
          (selectedCountByGroup.get(choice.groupId) ?? 0) + 1
        );

        selectedSnapshots.push({
          groupId: choice.groupId,
          groupLabel: choice.groupLabel,
          choiceId,
          choiceLabel: choice.choiceLabel,
          priceDelta: choice.priceDelta
        });
      }

      for (const group of menuItem.optionGroups) {
        const selectedCount = selectedCountByGroup.get(group.id) ?? 0;

        if (group.required && selectedCount === 0) {
          return NextResponse.json(
            {
              error: "REQUIRED_OPTION_MISSING",
              message: `Please select ${group.label} for ${menuItem.name}.`
            },
            { status: 400 }
          );
        }

        if (!group.multiple && selectedCount > 1) {
          return NextResponse.json(
            {
              error: "INVALID_CUSTOMISATION",
              message: `Only one ${group.label} may be selected for ${menuItem.name}.`
            },
            { status: 400 }
          );
        }
      }

      const unitPrice =
        Number(menuItem.price) +
        selectedSnapshots.reduce(
          (sum, selection) => sum + selection.priceDelta,
          0
        );

      preparedLines.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: line.quantity,
        note: line.note.trim().slice(0, 160) || null,
        unitPrice,
        selections: selectedSnapshots
      });
    }

    const subtotal = preparedLines.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        orderNumber: createOrderNumber(),
        status: "CONFIRMED",
        customerName: body.dinerName.trim() || null,
        note: body.orderNote.trim() || null,
        subtotal,
        total: subtotal,
        restaurantId: restaurant.id,
        tableId: table.id,
        items: {
          create: preparedLines.map((line) => ({
            menuItemId: line.menuItemId,
            name: line.name,
            unitPrice: line.unitPrice,
            quantity: line.quantity,
            note: line.note,
            selections: line.selections
          }))
        }
      },
      select: {
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true
      }
    });

    return NextResponse.json(
      {
        orderNumber: order.orderNumber,
        status: order.status,
        total: Number(order.total),
        createdAt: order.createdAt.toISOString()
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/orders failed", error);

    return NextResponse.json(
      {
        error: "ORDER_CREATE_FAILED",
        message: "Unable to place the order right now."
      },
      { status: 500 }
    );
  }
}
