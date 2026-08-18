import type { CartLine } from "@/features/cart/types/cart";

export type PlacedOrder = {
  orderNumber: string;
  tableCode: string;
  dinerName: string;
  note: string;
  total: number;
  createdAt: string;
  lines: CartLine[];
  status: "CONFIRMED" | "PREPARING" | "READY";
};
