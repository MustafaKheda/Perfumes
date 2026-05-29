import { findCollectionBySlug, getProducts } from "@/lib/api/catalog";
import { notFound, ok } from "@/lib/api/http";
import { secureAdminApi } from "@/lib/api/secure";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const secured = await secureAdminApi(request, { id: "collection-products" });
  if (secured) return secured;

  const { slug } = await context.params;
  const collection = await findCollectionBySlug(slug);

  if (!collection) {
    return notFound("Collection not found");
  }

  const { searchParams } = new URL(request.url);
  const result = await getProducts({
    collection: slug,
    search: searchParams.get("search"),
    tag: searchParams.get("tag"),
    bestSeller: searchParams.get("bestSeller"),
    featured: searchParams.get("featured"),
    sort: searchParams.get("sort"),
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  return ok({
    collection,
    ...result,
  });
}
