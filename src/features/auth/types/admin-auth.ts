export type DemoAdminRole =
  | "OWNER"
  | "MANAGER"
  | "CASHIER"
  | "KITCHEN"
  | "WAITER";

export type DemoLoginProfile = {
  role: DemoAdminRole;
  label: string;
  email: string;
  landingPath: string;
};
