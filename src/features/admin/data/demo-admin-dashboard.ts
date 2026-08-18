import type { AdminDashboardData } from "@/features/admin/types/admin-dashboard";

const now = Date.now();

export const demoAdminDashboard: AdminDashboardData = {
  metrics: [
    {
      id: "orders",
      label: "Today's orders",
      value: "48",
      helper: "+12% vs yesterday"
    },
    {
      id: "sales",
      label: "Today's sales",
      value: "RM 1,286.40",
      helper: "+8.4% vs yesterday"
    },
    {
      id: "active",
      label: "Active tables",
      value: "7",
      helper: "11 tables configured"
    },
    {
      id: "avg",
      label: "Average order",
      value: "RM 26.80",
      helper: "Dine-in average"
    }
  ],
  recentOrders: [
    {
      id: "admin-order-1",
      orderNumber: "250817-122144-481",
      tableCode: "A01",
      status: "CONFIRMED",
      total: 33.8,
      createdAt: new Date(now - 2 * 60 * 1000).toISOString()
    },
    {
      id: "admin-order-2",
      orderNumber: "250817-121902-114",
      tableCode: "B03",
      status: "PREPARING",
      total: 28.9,
      createdAt: new Date(now - 6 * 60 * 1000).toISOString()
    },
    {
      id: "admin-order-3",
      orderNumber: "250817-121117-776",
      tableCode: "A04",
      status: "READY",
      total: 23.9,
      createdAt: new Date(now - 12 * 60 * 1000).toISOString()
    },
    {
      id: "admin-order-4",
      orderNumber: "250817-120512-301",
      tableCode: "B08",
      status: "SERVED",
      total: 42.4,
      createdAt: new Date(now - 19 * 60 * 1000).toISOString()
    }
  ],
  popularItems: [
    {
      id: "signature-chicken-rice",
      name: "Signature Chicken Rice",
      orders: 18,
      revenue: 252.2
    },
    {
      id: "creamy-carbonara",
      name: "Creamy Carbonara",
      orders: 13,
      revenue: 265.7
    },
    {
      id: "crispy-wings",
      name: "Crispy Chicken Wings",
      orders: 9,
      revenue: 143.1
    }
  ]
};
