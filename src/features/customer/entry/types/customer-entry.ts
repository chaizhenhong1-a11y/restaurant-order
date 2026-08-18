export type CustomerEntryState =
  | "READY"
  | "NO_TABLE"
  | "INVALID_TABLE"
  | "DISABLED_TABLE"
  | "CLOSED";

export type CustomerTablePreview = {
  code: string;
  zone: string;
  seats: number;
  enabled: boolean;
};
