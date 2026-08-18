export type PaymentMethodKey =
  | "COUNTER"
  | "CARD"
  | "EWALLET";

export type BusinessDay = {
  day: string;
  enabled: boolean;
  open: string;
  close: string;
};

export type RestaurantSettings = {
  restaurantName: string;
  description: string;
  announcement: string;
  isOpen: boolean;
  currency: string;
  language: string;
  serviceChargePercent: number;
  taxPercent: number;
  minimumOrder: number;
  allowSpecialRequests: boolean;
  allowRepeatOrders: boolean;
  requireTableCode: boolean;
  paymentMethods: PaymentMethodKey[];
  businessHours: BusinessDay[];
};
