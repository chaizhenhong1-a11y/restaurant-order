export type AdminTableStatus = "AVAILABLE" | "OCCUPIED" | "DISABLED";

export type AdminTable = {
  id: string;
  code: string;
  seats: number;
  zone: string;
  status: AdminTableStatus;
};
