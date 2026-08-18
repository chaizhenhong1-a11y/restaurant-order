import { NextResponse } from "next/server";
import { demoKitchenOrders } from "@/features/kitchen/data/demo-kitchen-orders";
import { isDatabaseConfigured } from "@/lib/database";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      demoMode: true,
      orders: demoKitchenOrders
    });
  }

  try {
    const prisma = getPrisma();

    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ["CONFIRMED", "PREPARING", "READY"]
        }
      },
      orderBy: { createdAt: "asc" },
      include: {
        table: { select: { code: true } },
        items: { orderBy: { id: "asc" } }
      }
    });

    return NextResponse.json({
      demoMode: false,
      orders: orders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        tableCode: order.table.code,
        customerName: order.customerName ?? "",
        note: order.note ?? "",
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        total: Number(order.total),
        items: order.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          note: item.note ?? "",
          selections: Array.isArray(item.selections)
            ? item.selections
            : []
        }))
      }))
    });
  } catch {
    return NextResponse.json({
      demoMode: true,
      orders: demoKitchenOrders,
      warning: "DATABASE_UNAVAILABLE"
    });
  }
}
