import type { AdminTable } from "@/features/admin/tables/types/admin-table";

export const demoAdminTables: AdminTable[] = [
  { id: "table-a01", code: "A01", seats: 2, zone: "Main Hall", status: "AVAILABLE" },
  { id: "table-a02", code: "A02", seats: 2, zone: "Main Hall", status: "OCCUPIED" },
  { id: "table-a03", code: "A03", seats: 4, zone: "Main Hall", status: "AVAILABLE" },
  { id: "table-a04", code: "A04", seats: 4, zone: "Main Hall", status: "AVAILABLE" },
  { id: "table-a05", code: "A05", seats: 6, zone: "Main Hall", status: "DISABLED" },
  { id: "table-b01", code: "B01", seats: 2, zone: "Window", status: "AVAILABLE" },
  { id: "table-b02", code: "B02", seats: 2, zone: "Window", status: "OCCUPIED" },
  { id: "table-b03", code: "B03", seats: 4, zone: "Window", status: "AVAILABLE" },
  { id: "table-b04", code: "B04", seats: 4, zone: "Window", status: "AVAILABLE" },
  { id: "table-b05", code: "B05", seats: 6, zone: "Window", status: "AVAILABLE" },
  { id: "table-b08", code: "B08", seats: 8, zone: "Private", status: "AVAILABLE" }
];
