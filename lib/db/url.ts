export function getPostgresUrl(rawUrl: string | undefined) {
  if (!rawUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  const url = new URL(rawUrl);
  url.searchParams.delete("schema");

  return url.toString();
}
