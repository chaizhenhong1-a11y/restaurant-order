import type { MenuItem } from "@/features/menu/types/menu";

export type CartSelection = {
  groupId: string;
  groupLabel: string;
  choiceId: string;
  choiceLabel: string;
  priceDelta: number;
};

export type CartLine = {
  id: string;
  item: MenuItem;
  quantity: number;
  note: string;
  selections: CartSelection[];
  unitPrice: number;
};
