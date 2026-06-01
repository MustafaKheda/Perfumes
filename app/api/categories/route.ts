import { getCategories } from "@/lib/api/catalog";
import { ok } from "@/lib/api/http";
import { secureAdminApi } from "@/lib/api/secure";

export async function GET(request: Request) {
  const secured = await secureAdminApi(request, { id: "categories" });
  if (secured) return secured;

  const result = await getCategories();

  return ok(result);
}
