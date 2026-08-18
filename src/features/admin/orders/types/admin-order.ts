export type AdminOrderStatus =
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "SERVED"
  | "CANCELLED";

export type AdminOrderItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  note: string;
  selections: Array<{
    groupLabel: string;
    choiceLabel: string;
  }>;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  tableCode: string;
  customerName: string;
  status: AdminOrderStatus;
  total: number;
  createdAt: string;
  note: string;
  paymentMethod: string;
  items: AdminOrderItem[];
};
