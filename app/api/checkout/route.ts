import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { badRequest, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { cartItems, orderItems, orders, products } from "@/lib/db/schema";
import { requireCustomerUser } from "@/lib/user-auth";

type CheckoutBody = {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  addressLine1?: unknown;
  addressLine2?: unknown;
  city?: unknown;
  state?: unknown;
  postalCode?: unknown;
  country?: unknown;
};

export async function POST(request: Request) {
  const user = await requireCustomerUser();

  if (!user) {
    return unauthorized("Please sign in to place an order");
  }

  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const firstName = readString(body.firstName);
  const lastName = readString(body.lastName);
  const phone = readString(body.phone);
  const addressLine1 = readString(body.addressLine1);
  const addressLine2 = readString(body.addressLine2);
  const city = readString(body.city);
  const state = readString(body.state);
  const postalCode = readString(body.postalCode);
  const country = readString(body.country) || "India";

  if (!firstName || !lastName || !addressLine1 || !city || !state || !postalCode || !phone) {
    return badRequest("First name, last name, phone, address, city, state, and postal code are required");
  }

  const cartRows = await db
    .select({
      productId: products.id,
      name: products.name,
      image: products.image,
      price: products.price,
      quantity: cartItems.quantity,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, user.id));

  if (cartRows.length === 0) {
    return badRequest("Your cart is empty");
  }

  const subtotal = cartRows.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;

  const [order] = await db
    .insert(orders)
    .values({
      userId: user.id,
      customerEmail: user.email,
      customerName: `${firstName} ${lastName}`,
      customerPhone: phone,
      shippingAddress: {
        firstName,
        lastName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      },
      subtotal: subtotal.toFixed(2),
      shippingFee: shippingFee.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      status: "PENDING",
      paymentStatus: "PENDING",
    })
    .returning({ id: orders.id });

  await db.insert(orderItems).values(
    cartRows.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
  );

  await db.delete(cartItems).where(eq(cartItems.userId, user.id));

  return NextResponse.json({
    message: "Order created successfully",
    data: {
      orderId: order.id,
    },
  });
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
