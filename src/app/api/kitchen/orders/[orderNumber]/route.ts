import { NextResponse } from "next/server";
import type { KitchenOrderStatus } from "@/features/kitchen/types/kitchen-order";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

const allowedStatuses: KitchenOrderStatus[] = [
  "CONFIRMED",
  "PREPARING",
  "READY",
  "SERVED",
  "CANCELLED"
];

export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { orderNumber } = await context.params;
    const body = (await request.json()) as {
      status?: KitchenOrderStatus;
    };

    if (!body.status || !allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          error: "INVALID_STATUS",
          message: "Invalid kitchen order status."
        },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: {
        orderNumber
      },
      select: {
        id: true
      }
    });

    if (!existingOrder) {
      return NextResponse.json(
        {
          error: "ORDER_NOT_FOUND",
          message: "Order not found."
        },
        { status: 404 }
      );
    }

    const order = await prisma.order.update({
      where: {
        orderNumber
      },
      data: {
        status: body.status
      },
      select: {
        orderNumber: true,
        status: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      updatedAt: order.updatedAt.toISOString()
    });
  } catch (error) {
    console.error(
      "PATCH /api/kitchen/orders/[orderNumber] failed",
      error
    );

    return NextResponse.json(
      {
        error: "KITCHEN_ORDER_UPDATE_FAILED",
        message: "Unable to update the order status."
      },
      { status: 500 }
    );
  }
}
