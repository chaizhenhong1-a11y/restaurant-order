import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    orderNumber: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { orderNumber } = await context.params;

    const order = await prisma.order.findUnique({
      where: {
        orderNumber
      },
      select: {
        orderNumber: true,
        status: true,
        customerName: true,
        note: true,
        total: true,
        createdAt: true,
        table: {
          select: {
            code: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        {
          error: "ORDER_NOT_FOUND",
          message: "Order not found."
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      orderNumber: order.orderNumber,
      tableCode: order.table.code,
      dinerName: order.customerName ?? "",
      note: order.note ?? "",
      total: Number(order.total),
      status: order.status,
      createdAt: order.createdAt.toISOString()
    });
  } catch (error) {
    console.error("GET /api/orders/[orderNumber] failed", error);

    return NextResponse.json(
      {
        error: "ORDER_READ_FAILED",
        message: "Unable to load the order right now."
      },
      { status: 500 }
    );
  }
}
