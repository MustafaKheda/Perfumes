import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { badRequest, unauthorized } from "@/lib/api/http";
import { rateLimitOrResponse } from "@/lib/api/rate-limit";
import { db } from "@/lib/db";
import { products, wishlistItems } from "@/lib/db/schema";
import { requireCustomerUser } from "@/lib/user-auth";

type WishlistBody = {
  productId?: unknown;
};

export async function GET(request: Request) {
  const limited = rateLimitOrResponse(request, { id: "wishlist:get", limit: 60, windowMs: 60_000 });
  if (limited) return limited;

  const user = await requireCustomerUser();

  if (!user) {
    return unauthorized("Please sign in to view your wishlist");
  }

  const items = await db
    .select({
      id: wishlistItems.id,
      productId: products.id,
      slug: products.slug,
      name: products.name,
      image: products.image,
      price: products.price,
      notes: products.notes,
      tag: products.tag,
      categoryId: products.categoryId,
      createdAt: wishlistItems.createdAt,
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(and(eq(wishlistItems.userId, user.id), eq(products.isActive, true)))
    .orderBy(desc(wishlistItems.createdAt));

  return NextResponse.json({
    data: items.map((item) => ({
      ...item,
      price: Number(item.price),
      createdAt: item.createdAt.toISOString(),
    })),
    meta: {
      total: items.length,
      productIds: items.map((item) => item.productId),
    },
  });
}

export async function POST(request: Request) {
  const limited = rateLimitOrResponse(request, { id: "wishlist:post", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const user = await requireCustomerUser();

  if (!user) {
    return unauthorized("Please sign in before adding wishlist items");
  }

  const productId = await readProductId(request);

  if (!productId) {
    return badRequest("Product is required");
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.isActive, true)),
    columns: { id: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  await db
    .insert(wishlistItems)
    .values({
      userId: user.id,
      productId,
    })
    .onConflictDoNothing({
      target: [wishlistItems.userId, wishlistItems.productId],
    });

  return GET();
}

export async function DELETE(request: Request) {
  const limited = rateLimitOrResponse(request, { id: "wishlist:delete", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const user = await requireCustomerUser();

  if (!user) {
    return unauthorized("Please sign in to update your wishlist");
  }

  const productId = await readProductId(request);

  if (!productId) {
    return badRequest("Product is required");
  }

  await db
    .delete(wishlistItems)
    .where(
      and(
        eq(wishlistItems.userId, user.id),
        eq(wishlistItems.productId, productId),
      ),
    );

  return GET();
}

async function readProductId(request: Request) {
  try {
    const body = (await request.json()) as WishlistBody;
    return typeof body.productId === "string" ? body.productId : "";
  } catch {
    return "";
  }
}
