export function formatCurrency(
  amount: number,
  currency = "MYR",
  locale = "en-MY"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(amount);
}
