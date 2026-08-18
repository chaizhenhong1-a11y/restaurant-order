import type { CustomerTablePreview } from "@/features/customer/entry/types/customer-entry";

export const demoCustomerTables: CustomerTablePreview[] = [
  { code: "A01", zone: "Main Hall", seats: 2, enabled: true },
  { code: "A02", zone: "Main Hall", seats: 2, enabled: true },
  { code: "A03", zone: "Main Hall", seats: 4, enabled: true },
  { code: "A04", zone: "Main Hall", seats: 4, enabled: true },
  { code: "A05", zone: "Main Hall", seats: 6, enabled: false },
  { code: "B01", zone: "Window", seats: 2, enabled: true },
  { code: "B02", zone: "Window", seats: 2, enabled: true },
  { code: "B03", zone: "Window", seats: 4, enabled: true },
  { code: "B08", zone: "Private", seats: 8, enabled: true }
];

export const demoRestaurantOpen = true;
