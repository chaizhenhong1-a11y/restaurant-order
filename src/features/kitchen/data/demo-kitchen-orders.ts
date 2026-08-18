import type { KitchenOrder } from "@/features/kitchen/types/kitchen-order";

const now = Date.now();

export const demoKitchenOrders: KitchenOrder[] = [
  {
    id: "demo-1",
    orderNumber: "250817-120501-381",
    tableCode: "A01",
    customerName: "Alex",
    note: "Please serve drinks first.",
    status: "CONFIRMED",
    createdAt: new Date(now - 3 * 60 * 1000).toISOString(),
    total: 33.8,
    items: [
      {
        id: "demo-1-item-1",
        name: "Signature Chicken Rice",
        quantity: 1,
        note: "Sauce on the side",
        selections: [
          { groupLabel: "Size", choiceLabel: "Large" },
          { groupLabel: "Spice level", choiceLabel: "Mild" },
          { groupLabel: "Add-ons", choiceLabel: "Extra egg" }
        ]
      },
      {
        id: "demo-1-item-2",
        name: "Iced Lemon Tea",
        quantity: 2,
        note: "",
        selections: [
          { groupLabel: "Ice", choiceLabel: "Less ice" },
          { groupLabel: "Sweetness", choiceLabel: "50%" }
        ]
      }
    ]
  },
  {
    id: "demo-2",
    orderNumber: "250817-115814-652",
    tableCode: "B03",
    customerName: "",
    note: "",
    status: "PREPARING",
    createdAt: new Date(now - 9 * 60 * 1000).toISOString(),
    total: 28.9,
    items: [
      {
        id: "demo-2-item-1",
        name: "Creamy Carbonara",
        quantity: 1,
        note: "",
        selections: [
          { groupLabel: "Size", choiceLabel: "Large" },
          { groupLabel: "Add-ons", choiceLabel: "Mushroom" }
        ]
      }
    ]
  },
  {
    id: "demo-3",
    orderNumber: "250817-114221-127",
    tableCode: "A04",
    customerName: "Mei",
    note: "Birthday table",
    status: "READY",
    createdAt: new Date(now - 16 * 60 * 1000).toISOString(),
    total: 23.9,
    items: [
      {
        id: "demo-3-item-1",
        name: "Crispy Chicken Wings",
        quantity: 1,
        note: "Extra napkins",
        selections: [
          { groupLabel: "Portion", choiceLabel: "10 pieces" },
          { groupLabel: "Sauce", choiceLabel: "Honey garlic" }
        ]
      }
    ]
  }
];
