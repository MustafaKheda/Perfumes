import { desc, eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { cartItems, products, users } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const rows = await db
    .select({
      cartItemId: cartItems.id,
      quantity: cartItems.quantity,
      scentOption: cartItems.scentOption,
      addedAt: cartItems.createdAt,
      updatedAt: cartItems.updatedAt,
      userId: users.id,
      userName: users.name,
      userEmail: users.email,
      productId: products.id,
      productName: products.name,
      productImage: products.image,
      productPrice: products.price,
    })
    .from(cartItems)
    .innerJoin(users, eq(cartItems.userId, users.id))
    .innerJoin(products, eq(cartItems.productId, products.id))
    .orderBy(desc(cartItems.updatedAt));

  const cartsByUser = new Map<
    string,
    {
      user: {
        id: string;
        name: string | null;
        email: string;
      };
      items: Array<{
        id: string;
        productId: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
        scentOption: string | null;
        addedAt: string;
        updatedAt: string;
      }>;
      totalQuantity: number;
      subtotal: number;
      lastUpdatedAt: string;
    }
  >();

  for (const row of rows) {
    const existing = cartsByUser.get(row.userId);
    const item = {
      id: row.cartItemId,
      productId: row.productId,
      name: row.productName,
      image: row.productImage,
      price: Number(row.productPrice),
      quantity: row.quantity,
      scentOption: row.scentOption,
      addedAt: row.addedAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };

    if (!existing) {
      cartsByUser.set(row.userId, {
        user: {
          id: row.userId,
          name: row.userName,
          email: row.userEmail,
        },
        items: [item],
        totalQuantity: item.quantity,
        subtotal: item.quantity * item.price,
        lastUpdatedAt: item.updatedAt,
      });
      continue;
    }

    existing.items.push(item);
    existing.totalQuantity += item.quantity;
    existing.subtotal += item.quantity * item.price;

    if (new Date(item.updatedAt) > new Date(existing.lastUpdatedAt)) {
      existing.lastUpdatedAt = item.updatedAt;
    }
  }

  return NextResponse.json({
    data: Array.from(cartsByUser.values()),
  });
}
