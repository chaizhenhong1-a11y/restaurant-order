import type { AnalyticsData } from "@/features/admin/analytics/types/admin-analytics";

export const demoAdminAnalytics: AnalyticsData = {
  metrics: [
    {
      id: "sales",
      label: "Gross sales",
      value: "RM 8,462.30",
      helper: "+12.4% vs previous period"
    },
    {
      id: "orders",
      label: "Orders",
      value: "318",
      helper: "+8.1% vs previous period"
    },
    {
      id: "average",
      label: "Average order",
      value: "RM 26.61",
      helper: "+3.9% vs previous period"
    },
    {
      id: "completion",
      label: "Completion rate",
      value: "96.8%",
      helper: "10 cancelled orders"
    }
  ],
  sales: [
    { label: "Mon", value: 890 },
    { label: "Tue", value: 1040 },
    { label: "Wed", value: 930 },
    { label: "Thu", value: 1210 },
    { label: "Fri", value: 1490 },
    { label: "Sat", value: 1625 },
    { label: "Sun", value: 1277 }
  ],
  popularDishes: [
    {
      id: "signature-chicken-rice",
      name: "Signature Chicken Rice",
      orders: 82,
      revenue: 1214.8
    },
    {
      id: "creamy-carbonara",
      name: "Creamy Carbonara",
      orders: 64,
      revenue: 1289.6
    },
    {
      id: "crispy-wings",
      name: "Crispy Chicken Wings",
      orders: 51,
      revenue: 810.9
    },
    {
      id: "iced-lemon-tea",
      name: "Iced Lemon Tea",
      orders: 47,
      revenue: 324.3
    }
  ],
  hourlyOrders: [
    { hour: "10", orders: 12 },
    { hour: "11", orders: 21 },
    { hour: "12", orders: 39 },
    { hour: "13", orders: 45 },
    { hour: "14", orders: 31 },
    { hour: "15", orders: 18 },
    { hour: "16", orders: 15 },
    { hour: "17", orders: 24 },
    { hour: "18", orders: 35 },
    { hour: "19", orders: 42 },
    { hour: "20", orders: 26 },
    { hour: "21", orders: 10 }
  ],
  tablePerformance: [
    { tableCode: "A01", orders: 31, revenue: 842.6 },
    { tableCode: "B03", orders: 28, revenue: 795.2 },
    { tableCode: "A04", orders: 26, revenue: 731.5 },
    { tableCode: "B08", orders: 24, revenue: 702.4 },
    { tableCode: "A02", orders: 21, revenue: 641.9 }
  ]
};
