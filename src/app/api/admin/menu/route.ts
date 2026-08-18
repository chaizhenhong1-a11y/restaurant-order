import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  demoAdminMenuCategories,
  demoAdminMenuItems
} from "@/features/admin/menu/data/demo-admin-menu";
import type { AdminMenuItemInput } from "@/features/admin/menu/types/admin-menu";
import { isDatabaseConfigured } from "@/lib/database";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

function serializeItem(item: any) {
  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    imageUrl: item.imageUrl ?? "",
    price: Number(item.price),
    categoryId: item.categoryId,
    categoryName: item.category.name,
    isAvailable: item.isAvailable,
    isPopular: item.isPopular,
    optionGroups: item.optionGroups.map((group: any) => ({
      id: group.id,
      label: group.label,
      required: group.required,
      multiple: group.multiple,
      choices: group.choices.map((choice: any) => ({
        id: choice.id,
        label: choice.label,
        priceDelta: Number(choice.priceDelta)
      }))
    }))
  };
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      demoMode: true,
      categories: demoAdminMenuCategories,
      items: demoAdminMenuItems
    });
  }

  try {
    const prisma = getPrisma();

    const [categories, items] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: { menuItems: true }
          }
        }
      }),
      prisma.menuItem.findMany({
        orderBy: [
          { category: { sortOrder: "asc" } },
          { sortOrder: "asc" },
          { name: "asc" }
        ],
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
      })
    ]);

    return NextResponse.json({
      demoMode: false,
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        itemCount: category._count.menuItems
      })),
      items: items.map(serializeItem)
    });
  } catch {
    return NextResponse.json({
      demoMode: true,
      categories: demoAdminMenuCategories,
      items: demoAdminMenuItems,
      warning: "DATABASE_UNAVAILABLE"
    });
  }
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        demoMode: true,
        error: "DATABASE_NOT_CONFIGURED",
        message: "New dishes are local-only in Demo mode."
      },
      { status: 503 }
    );
  }

  try {
    const prisma = getPrisma();
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

    const category = await prisma.category.findUnique({
      where: { id: body.categoryId },
      select: { id: true, restaurantId: true }
    });

    if (!category) {
      return NextResponse.json(
        { error: "CATEGORY_NOT_FOUND", message: "Category not found." },
        { status: 404 }
      );
    }

    const sortOrder =
      (await prisma.menuItem.count({
        where: { categoryId: category.id }
      })) * 10 + 10;

    const created = await prisma.menuItem.create({
      data: {
        name: body.name.trim().slice(0, 120),
        description: body.description.trim().slice(0, 500) || null,
        imageUrl: body.imageUrl.trim() || null,
        price: body.price,
        categoryId: category.id,
        restaurantId: category.restaurantId,
        isAvailable: body.isAvailable,
        isPopular: body.isPopular,
        sortOrder,
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

    return NextResponse.json(serializeItem(created), { status: 201 });
  } catch {
    return NextResponse.json(
      {
        error: "MENU_ITEM_CREATE_FAILED",
        message: "Unable to create dish."
      },
      { status: 500 }
    );
  }
}
