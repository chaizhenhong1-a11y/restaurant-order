import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/database";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        demoMode: true,
        error: "DATABASE_NOT_CONFIGURED",
        message: "Categories are local-only in Demo mode."
      },
      { status: 503 }
    );
  }

  try {
    const prisma = getPrisma();
    const body = (await request.json()) as { name?: string };
    const name = body.name?.trim() ?? "";

    if (!name) {
      return NextResponse.json(
        {
          error: "INVALID_CATEGORY",
          message: "Category name is required."
        },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: "mellow-kitchen" },
      select: { id: true }
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

    const baseSlug = slugify(name) || "category";
    let slug = baseSlug;
    let suffix = 2;

    while (
      await prisma.category.findUnique({
        where: {
          restaurantId_slug: {
            restaurantId: restaurant.id,
            slug
          }
        },
        select: { id: true }
      })
    ) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const sortOrder =
      (await prisma.category.count({
        where: { restaurantId: restaurant.id }
      })) * 10 + 10;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        sortOrder,
        restaurantId: restaurant.id
      }
    });

    return NextResponse.json(
      {
        id: category.id,
        name: category.name,
        slug: category.slug,
        itemCount: 0
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "CATEGORY_CREATE_FAILED",
        message: "Unable to create category."
      },
      { status: 500 }
    );
  }
}
