export type CreateOrderSelectionInput = {
  choiceId: string;
};

export type CreateOrderLineInput = {
  menuItemId: string;
  quantity: number;
  note: string;
  selections: CreateOrderSelectionInput[];
};

export type CreateOrderRequest = {
  restaurantSlug: string;
  tableCode: string;
  dinerName: string;
  orderNote: string;
  lines: CreateOrderLineInput[];
};

export type CreateOrderResponse = {
  orderNumber: string;
  status: "CONFIRMED";
  total: number;
  createdAt: string;
};

export type OrderStatusResponse = {
  orderNumber: string;
  tableCode: string;
  dinerName: string;
  note: string;
  total: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "READY"
    | "SERVED"
    | "CANCELLED";
  createdAt: string;
};
