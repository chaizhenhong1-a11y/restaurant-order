export function getDatabaseUrl() {
  const value = process.env.DATABASE_URL?.trim();
  return value ? value : null;
}

export function isDatabaseConfigured() {
  return getDatabaseUrl() !== null;
}
