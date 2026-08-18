export type KitchenOrderStatus =
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "CANCELLED";

export type KitchenOrderItem = {
  id: string;
  name: string;
  quantity: number;
  note: string;
  selections: Array<{
    groupLabel: string;
    choiceLabel: string;
  }>;
};

export type KitchenOrder = {
  id: string;
  orderNumber: string;
  tableCode: string;
  customerName: string;
  note: string;
  status: KitchenOrderStatus;
  createdAt: string;
  total: number;
  items: KitchenOrderItem[];
};
