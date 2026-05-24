import { findProductByIdOrSlug } from "@/lib/api/catalog";
import { notFound, ok } from "@/lib/api/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const product = await findProductByIdOrSlug(id);

  if (!product) {
    return notFound("Product not found");
  }

  return ok({ data: product });
}
