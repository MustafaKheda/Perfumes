import { findCategoryBySlug, getProducts } from "@/lib/api/catalog";
import { notFound, ok } from "@/lib/api/http";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const category = await findCategoryBySlug(slug);

  if (!category) {
    return notFound("Category not found");
  }

  const { searchParams } = new URL(request.url);
  const result = await getProducts({
    category: slug,
    search: searchParams.get("search"),
    tag: searchParams.get("tag"),
    bestSeller: searchParams.get("bestSeller"),
    featured: searchParams.get("featured"),
    sort: searchParams.get("sort"),
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  return ok({
    category,
    ...result,
  });
}
