import { getCategories } from "@/lib/api/catalog";
import { ok } from "@/lib/api/http";

export async function GET() {
  const result = await getCategories();

  return ok(result);
}
