import { findCollectionBySlug } from "@/lib/api/catalog";
import { notFound, ok } from "@/lib/api/http";
import { secureAdminApi } from "@/lib/api/secure";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const secured = await secureAdminApi(request, { id: "collection" });
  if (secured) return secured;

  const { slug } = await context.params;
  const collection = await findCollectionBySlug(slug);

  if (!collection) {
    return notFound("Collection not found");
  }

  return ok({ data: collection });
}
