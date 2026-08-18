export type StaffRole = "OWNER" | "MANAGER" | "CASHIER" | "KITCHEN" | "WAITER";
export type StaffStatus = "ACTIVE" | "DISABLED";
export type StaffPermissionKey =
  | "DASHBOARD" | "ORDERS" | "MENU" | "TABLES"
  | "ANALYTICS" | "SETTINGS" | "STAFF" | "KITCHEN";

export type AdminStaffMember = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: StaffStatus;
  lastLoginAt: string | null;
  permissions: StaffPermissionKey[];
};
