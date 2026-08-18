import type { DemoLoginProfile } from "@/features/auth/types/admin-auth";

export const demoLoginProfiles: DemoLoginProfile[] = [
  {
    role: "OWNER",
    label: "Owner",
    email: "owner@mellowkitchen.demo",
    landingPath: "/admin"
  },
  {
    role: "MANAGER",
    label: "Manager",
    email: "manager@mellowkitchen.demo",
    landingPath: "/admin"
  },
  {
    role: "CASHIER",
    label: "Cashier",
    email: "cashier@mellowkitchen.demo",
    landingPath: "/admin/orders"
  },
  {
    role: "KITCHEN",
    label: "Kitchen Staff",
    email: "kitchen@mellowkitchen.demo",
    landingPath: "/kitchen"
  },
  {
    role: "WAITER",
    label: "Waiter",
    email: "waiter@mellowkitchen.demo",
    landingPath: "/admin/orders"
  }
];
