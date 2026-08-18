export function createOrderNumber() {
  const now = new Date();

  const date = [
    now.getFullYear().toString().slice(-2),
    (now.getMonth() + 1).toString().padStart(2, "0"),
    now.getDate().toString().padStart(2, "0")
  ].join("");

  const time = [
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0")
  ].join("");

  const random = Math.floor(100 + Math.random() * 900);

  return `${date}-${time}-${random}`;
}
