import { and, eq, inArray } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, ok, unauthorized } from "@/lib/api/http";
import {
  evaluateBestSellers,
  getBestSellerMode,
  getProductSalesMetrics,
  setBestSellerMode,
  type BestSellerMode,
} from "@/lib/api/best-sellers";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

type BestSellerBody = {
  mode?: unknown;
  bestSellerIds?: unknown;
  trendingIds?: unknown;
};

export async function GET() {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  return ok(await getAdminBestSellerData());
}

export async function POST() {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  await setBestSellerMode("auto");
  await evaluateBestSellers();

  return ok({
    message: "Best seller evaluation completed",
    ...(await getAdminBestSellerData()),
  });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  let body: BestSellerBody;

  try {
    body = (await request.json()) as BestSellerBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const mode = normalizeMode(body.mode);

  if (mode) {
    await setBestSellerMode(mode);
  }

  const bestSellerIds = normalizeIds(body.bestSellerIds);
  const trendingIds = normalizeIds(body.trendingIds);

  if (bestSellerIds || trendingIds) {
    await setBestSellerMode("manual");

    await db.transaction(async (tx) => {
      if (bestSellerIds) {
        await tx.update(products).set({
          isBestSeller: false,
          updatedAt: new Date(),
        });

        if (bestSellerIds.length > 0) {
          await tx
            .update(products)
            .set({
              isBestSeller: true,
              updatedAt: new Date(),
            })
            .where(and(inArray(products.id, bestSellerIds), eq(products.isActive, true)));
        }
      }

      if (trendingIds) {
        await tx.update(products).set({
          isFeatured: false,
          updatedAt: new Date(),
        });

        if (trendingIds.length > 0) {
          await tx
            .update(products)
            .set({
              isFeatured: true,
              updatedAt: new Date(),
            })
            .where(and(inArray(products.id, trendingIds), eq(products.isActive, true)));
        }
      }
    });
  }

  return ok({
    message: "Best seller settings updated",
    ...(await getAdminBestSellerData()),
  });
}

async function getAdminBestSellerData() {
  const [mode, metrics, productRows] = await Promise.all([
    getBestSellerMode(),
    getProductSalesMetrics(),
    db.query.products.findMany({
      columns: {
        id: true,
        modelNo: true,
        name: true,
        slug: true,
        image: true,
        isBestSeller: true,
        isFeatured: true,
        isActive: true,
      },
      orderBy: (table, { asc }) => [asc(table.name)],
    }),
  ]);

  const metricsByProduct = new Map(metrics.map((item) => [item.productId, item]));

  return {
    data: {
      mode,
      products: productRows.map((product) => ({
        ...product,
        metrics: metricsByProduct.get(product.id) ?? {
          productId: product.id,
          monthlySold: 0,
          trendingSold: 0,
          totalSold: 0,
        },
      })),
    },
  };
}

function normalizeMode(value: unknown): BestSellerMode | null {
  if (value === "auto" || value === "manual") {
    return value;
  }

  return null;
}

function normalizeIds(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  return [...new Set(value.filter((item): item is string => typeof item === "string"))];
}
