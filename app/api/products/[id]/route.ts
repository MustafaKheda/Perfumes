import { findProductByIdOrSlug } from "@/lib/api/catalog";
import { notFound, ok } from "@/lib/api/http";
import { secureAdminApi } from "@/lib/api/secure";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: Request, context: RouteContext) {
  const secured = await secureAdminApi(request, { id: "product" });
  if (secured) return secured;

  const { id } = await context.params;
  const product = await findProductByIdOrSlug(id);

  if (!product) {
    return notFound("Product not found");
  }

  return ok({ data: product });
}
