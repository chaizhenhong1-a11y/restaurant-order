import type { AdminOrder } from "@/features/admin/orders/types/admin-order";

const now = Date.now();

export const demoAdminOrders: AdminOrder[] = [
  {
    id: "order-1",
    orderNumber: "250817-140201-381",
    tableCode: "A01",
    customerName: "Alex",
    status: "CONFIRMED",
    total: 33.8,
    createdAt: new Date(now - 2 * 60 * 1000).toISOString(),
    note: "Please serve drinks first.",
    paymentMethod: "Pay at counter",
    items: [
      {
        id: "order-1-item-1",
        name: "Signature Chicken Rice",
        quantity: 1,
        unitPrice: 18.9,
        note: "Sauce on the side",
        selections: [
          { groupLabel: "Size", choiceLabel: "Large" },
          { groupLabel: "Spice level", choiceLabel: "Mild" },
          { groupLabel: "Add-ons", choiceLabel: "Extra egg" }
        ]
      },
      {
        id: "order-1-item-2",
        name: "Iced Lemon Tea",
        quantity: 2,
        unitPrice: 7.45,
        note: "",
        selections: [
          { groupLabel: "Ice", choiceLabel: "Less ice" },
          { groupLabel: "Sweetness", choiceLabel: "50%" }
        ]
      }
    ]
  },
  {
    id: "order-2",
    orderNumber: "250817-135724-441",
    tableCode: "B03",
    customerName: "",
    status: "PREPARING",
    total: 28.9,
    createdAt: new Date(now - 8 * 60 * 1000).toISOString(),
    note: "",
    paymentMethod: "Pay at counter",
    items: [
      {
        id: "order-2-item-1",
        name: "Creamy Carbonara",
        quantity: 1,
        unitPrice: 23.9,
        note: "",
        selections: [
          { groupLabel: "Size", choiceLabel: "Large" },
          { groupLabel: "Add-ons", choiceLabel: "Mushroom" }
        ]
      },
      {
        id: "order-2-item-2",
        name: "Iced Lemon Tea",
        quantity: 1,
        unitPrice: 5,
        note: "",
        selections: [
          { groupLabel: "Ice", choiceLabel: "Normal ice" },
          { groupLabel: "Sweetness", choiceLabel: "100%" }
        ]
      }
    ]
  },
  {
    id: "order-3",
    orderNumber: "250817-134950-109",
    tableCode: "A04",
    customerName: "Mei",
    status: "READY",
    total: 23.9,
    createdAt: new Date(now - 14 * 60 * 1000).toISOString(),
    note: "Birthday table",
    paymentMethod: "Pay at counter",
    items: [
      {
        id: "order-3-item-1",
        name: "Crispy Chicken Wings",
        quantity: 1,
        unitPrice: 23.9,
        note: "Extra napkins",
        selections: [
          { groupLabel: "Portion", choiceLabel: "10 pieces" },
          { groupLabel: "Sauce", choiceLabel: "Honey garlic" }
        ]
      }
    ]
  },
  {
    id: "order-4",
    orderNumber: "250817-132502-811",
    tableCode: "B08",
    customerName: "Daniel",
    status: "SERVED",
    total: 42.4,
    createdAt: new Date(now - 31 * 60 * 1000).toISOString(),
    note: "",
    paymentMethod: "Pay at counter",
    items: [
      {
        id: "order-4-item-1",
        name: "Signature Chicken Rice",
        quantity: 2,
        unitPrice: 16.9,
        note: "",
        selections: [
          { groupLabel: "Size", choiceLabel: "Regular" },
          { groupLabel: "Spice level", choiceLabel: "Hot" }
        ]
      },
      {
        id: "order-4-item-2",
        name: "Iced Lemon Tea",
        quantity: 1,
        unitPrice: 8.6,
        note: "",
        selections: [
          { groupLabel: "Ice", choiceLabel: "No ice" },
          { groupLabel: "Sweetness", choiceLabel: "0%" }
        ]
      }
    ]
  },
  {
    id: "order-5",
    orderNumber: "250817-125834-220",
    tableCode: "A02",
    customerName: "",
    status: "CANCELLED",
    total: 15.9,
    createdAt: new Date(now - 48 * 60 * 1000).toISOString(),
    note: "Guest changed order.",
    paymentMethod: "Pay at counter",
    items: [
      {
        id: "order-5-item-1",
        name: "Crispy Chicken Wings",
        quantity: 1,
        unitPrice: 15.9,
        note: "",
        selections: [
          { groupLabel: "Portion", choiceLabel: "6 pieces" },
          { groupLabel: "Sauce", choiceLabel: "Original" }
        ]
      }
    ]
  }
];
