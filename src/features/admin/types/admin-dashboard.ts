export type AdminSummaryMetric = {
  id: string;
  label: string;
  value: string;
  helper: string;
};

export type AdminRecentOrder = {
  id: string;
  orderNumber: string;
  tableCode: string;
  status: "CONFIRMED" | "PREPARING" | "READY" | "SERVED";
  total: number;
  createdAt: string;
};

export type AdminPopularItem = {
  id: string;
  name: string;
  orders: number;
  revenue: number;
};

export type AdminDashboardData = {
  metrics: AdminSummaryMetric[];
  recentOrders: AdminRecentOrder[];
  popularItems: AdminPopularItem[];
};
