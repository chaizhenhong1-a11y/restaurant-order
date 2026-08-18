import type { RestaurantSettings } from "@/features/admin/settings/types/restaurant-settings";

export const demoRestaurantSettings: RestaurantSettings = {
  restaurantName: "Mellow Kitchen",
  description:
    "Comfort food, fresh drinks and casual dining from your table.",
  announcement:
    "Welcome to Mellow Kitchen. Please let our team know about any food allergies.",
  isOpen: true,
  currency: "MYR",
  language: "English",
  serviceChargePercent: 0,
  taxPercent: 0,
  minimumOrder: 0,
  allowSpecialRequests: true,
  allowRepeatOrders: true,
  requireTableCode: true,
  paymentMethods: ["COUNTER"],
  businessHours: [
    { day: "Monday", enabled: true, open: "10:00", close: "22:00" },
    { day: "Tuesday", enabled: true, open: "10:00", close: "22:00" },
    { day: "Wednesday", enabled: true, open: "10:00", close: "22:00" },
    { day: "Thursday", enabled: true, open: "10:00", close: "22:00" },
    { day: "Friday", enabled: true, open: "10:00", close: "23:00" },
    { day: "Saturday", enabled: true, open: "10:00", close: "23:00" },
    { day: "Sunday", enabled: true, open: "10:00", close: "22:00" }
  ]
};
