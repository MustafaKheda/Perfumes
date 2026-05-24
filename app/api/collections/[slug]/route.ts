import { findCollectionBySlug } from "@/lib/api/catalog";
import { notFound, ok } from "@/lib/api/http";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const collection = await findCollectionBySlug(slug);

  if (!collection) {
    return notFound("Collection not found");
  }

  return ok({ data: collection });
}
