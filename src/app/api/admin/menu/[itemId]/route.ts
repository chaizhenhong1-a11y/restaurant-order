import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import type { AdminMenuItemInput } from "@/features/admin/menu/types/admin-menu";
import { isDatabaseConfigured } from "@/lib/database";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        demoMode: true,
        error: "DATABASE_NOT_CONFIGURED",
        message: "Changes are local-only while Demo mode is active."
      },
      { status: 503 }
    );
  }

  try {
    const prisma = getPrisma();
    const { itemId } = await context.params;
    const body = (await request.json()) as AdminMenuItemInput;

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "INVALID_NAME", message: "Dish name is required." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(body.price) || body.price < 0) {
      return NextResponse.json(
        { error: "INVALID_PRICE", message: "Price must be zero or greater." },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      await tx.menuOptionGroup.deleteMany({
        where: { menuItemId: itemId }
      });

      return tx.menuItem.update({
        where: { id: itemId },
        data: {
          name: body.name.trim().slice(0, 120),
          description: body.description.trim().slice(0, 500) || null,
          imageUrl: body.imageUrl.trim() || null,
          price: body.price,
          categoryId: body.categoryId,
          isAvailable: body.isAvailable,
          isPopular: body.isPopular,
          optionGroups: {
            create: body.optionGroups.map((group, groupIndex) => ({
              id: randomUUID(),
              label: group.label.trim() || `Option ${groupIndex + 1}`,
              required: group.required,
              multiple: group.multiple,
              sortOrder: groupIndex,
              choices: {
                create: group.choices
                  .filter((choice) => choice.label.trim())
                  .map((choice, choiceIndex) => ({
                    id: randomUUID(),
                    label: choice.label.trim(),
                    priceDelta: Number.isFinite(choice.priceDelta)
                      ? Math.max(0, choice.priceDelta)
                      : 0,
                    sortOrder: choiceIndex
                  }))
              }
            }))
          }
        },
        include: {
          category: true,
          optionGroups: {
            orderBy: { sortOrder: "asc" },
            include: {
              choices: {
                orderBy: { sortOrder: "asc" }
              }
            }
          }
        }
      });
    });

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      description: updated.description ?? "",
      imageUrl: updated.imageUrl ?? "",
      price: Number(updated.price),
      categoryId: updated.categoryId,
      categoryName: updated.category.name,
      isAvailable: updated.isAvailable,
      isPopular: updated.isPopular,
      optionGroups: updated.optionGroups.map((group) => ({
        id: group.id,
        label: group.label,
        required: group.required,
        multiple: group.multiple,
        choices: group.choices.map((choice) => ({
          id: choice.id,
          label: choice.label,
          priceDelta: Number(choice.priceDelta)
        }))
      }))
    });
  } catch {
    return NextResponse.json(
      {
        error: "ADMIN_MENU_UPDATE_FAILED",
        message: "Unable to update this menu item."
      },
      { status: 500 }
    );
  }
}
