import { NextResponse } from "next/server";
import { demoAdminDashboard } from "@/features/admin/data/demo-admin-dashboard";
import { isDatabaseConfigured } from "@/lib/database";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({
      ...demoAdminDashboard,
      demoMode: true
    });
  }

  try {
    const prisma = getPrisma();
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const [ordersToday, activeTables, recentOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfDay },
          status: { not: "CANCELLED" }
        },
        select: { total: true }
      }),
      prisma.diningTable.count({
        where: { status: "OCCUPIED" }
      }),
      prisma.order.findMany({
        where: { status: { not: "CANCELLED" } },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
          table: {
            select: { code: true }
          }
        }
      })
    ]);

    const sales = ordersToday.reduce(
      (sum, order) => sum + Number(order.total),
      0
    );

    const average =
      ordersToday.length > 0 ? sales / ordersToday.length : 0;

    return NextResponse.json({
      demoMode: false,
      metrics: [
        {
          id: "orders",
          label: "Today's orders",
          value: String(ordersToday.length),
          helper: "Live from PostgreSQL"
        },
        {
          id: "sales",
          label: "Today's sales",
          value: `RM ${sales.toFixed(2)}`,
          helper: "Excludes cancelled orders"
        },
        {
          id: "active",
          label: "Active tables",
          value: String(activeTables),
          helper: "Currently occupied"
        },
        {
          id: "avg",
          label: "Average order",
          value: `RM ${average.toFixed(2)}`,
          helper: "Today's average"
        }
      ],
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        tableCode: order.table.code,
        status: order.status,
        total: Number(order.total),
        createdAt: order.createdAt.toISOString()
      })),
      popularItems: []
    });
  } catch {
    return NextResponse.json({
      ...demoAdminDashboard,
      demoMode: true,
      warning: "DATABASE_UNAVAILABLE"
    });
  }
}
