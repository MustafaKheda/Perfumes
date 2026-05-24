import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { badRequest, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { cartItems, products } from "@/lib/db/schema";
import { requireCustomerUser } from "@/lib/user-auth";

type CartBody = {
  productId?: unknown;
  quantity?: unknown;
};

export async function GET() {
  const user = await requireCustomerUser();

  if (!user) {
    return unauthorized("Please sign in to view your cart");
  }

  const items = await db
    .select({
      id: cartItems.id,
      productId: products.id,
      name: products.name,
      image: products.image,
      price: products.price,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id));

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );

  return NextResponse.json({
    data: items.map((item) => ({
      ...item,
      price: Number(item.price),
    })),
    meta: {
      totalQuantity,
      subtotal,
    },
  });
}

export async function POST(request: Request) {
  const user = await requireCustomerUser();

  if (!user) {
    return unauthorized("Please sign in before adding items to your cart");
  }

  const body = await readCartBody(request);
  const productId = typeof body.productId === "string" ? body.productId : "";
  const quantity = normalizeQuantity(body.quantity, 1);

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
    .insert(cartItems)
    .values({
      userId: user.id,
      productId,
      quantity,
    })
    .onConflictDoUpdate({
      target: [cartItems.userId, cartItems.productId],
      set: {
        quantity: sql`${cartItems.quantity} + ${quantity}`,
        updatedAt: new Date(),
      },
    });

  return GET();
}

export async function PATCH(request: Request) {
  const user = await requireCustomerUser();

  if (!user) {
    return unauthorized("Please sign in to update your cart");
  }

  const body = await readCartBody(request);
  const productId = typeof body.productId === "string" ? body.productId : "";
  const quantity = normalizeQuantity(body.quantity, 1);

  if (!productId) {
    return badRequest("Product is required");
  }

  await db
    .update(cartItems)
    .set({
      quantity,
      updatedAt: new Date(),
    })
    .where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)));

  return GET();
}

export async function DELETE(request: Request) {
  const user = await requireCustomerUser();

  if (!user) {
    return unauthorized("Please sign in to update your cart");
  }

  const body = await readCartBody(request);
  const productId = typeof body.productId === "string" ? body.productId : "";

  if (!productId) {
    return badRequest("Product is required");
  }

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.userId, user.id), eq(cartItems.productId, productId)));

  return GET();
}

async function readCartBody(request: Request): Promise<CartBody> {
  try {
    return (await request.json()) as CartBody;
  } catch {
    return {};
  }
}

function normalizeQuantity(value: unknown, fallback: number) {
  const quantity = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return fallback;
  }

  return Math.min(quantity, 99);
}
