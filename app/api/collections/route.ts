import { getCollections } from "@/lib/api/catalog";
import { ok } from "@/lib/api/http";
import { secureAdminApi } from "@/lib/api/secure";

export async function GET(request: Request) {
  const secured = await secureAdminApi(request, { id: "collections" });
  if (secured) return secured;

  const result = await getCollections();

  return ok(result);
}
