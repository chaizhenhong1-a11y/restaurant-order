export type AnalyticsMetric = {
  id: string;
  label: string;
  value: string;
  helper: string;
};

export type SalesPoint = {
  label: string;
  value: number;
};

export type PopularDishStat = {
  id: string;
  name: string;
  orders: number;
  revenue: number;
};

export type HourStat = {
  hour: string;
  orders: number;
};

export type TableStat = {
  tableCode: string;
  orders: number;
  revenue: number;
};

export type AnalyticsData = {
  metrics: AnalyticsMetric[];
  sales: SalesPoint[];
  popularDishes: PopularDishStat[];
  hourlyOrders: HourStat[];
  tablePerformance: TableStat[];
};
