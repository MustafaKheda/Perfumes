import { getProducts } from "@/lib/api/catalog";
import { ok } from "@/lib/api/http";
import { secureAdminApi } from "@/lib/api/secure";

export async function GET(request: Request) {
  const secured = await secureAdminApi(request, { id: "products" });
  if (secured) return secured;

  const { searchParams } = new URL(request.url);

  const result = await getProducts({
    category: searchParams.get("category"),
    collection: searchParams.get("collection"),
    search: searchParams.get("search"),
    tag: searchParams.get("tag"),
    bestSeller: searchParams.get("bestSeller"),
    featured: searchParams.get("featured"),
    sort: searchParams.get("sort"),
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  return ok(result);
}
