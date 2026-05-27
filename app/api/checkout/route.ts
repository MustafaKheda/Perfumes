import { and, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { badRequest } from "@/lib/api/http";
import { db } from "@/lib/db";
import {
  cartItems,
  orderItems,
  orderStatusHistory,
  orders,
  products,
} from "@/lib/db/schema";
import { City, Country, State } from "country-state-city";
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import { isPostalCodeValid } from "@/lib/postal-code";
import { requireCustomerUser } from "@/lib/user-auth";

type CheckoutBody = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  dialCode?: unknown;
  phone?: unknown;
  addressLine1?: unknown;
  addressLine2?: unknown;
  city?: unknown;
  countryCode?: unknown;
  state?: unknown;
  stateCode?: unknown;
  postalCode?: unknown;
  country?: unknown;
  guestItems?: unknown;
};

export async function POST(request: Request) {
  try {
    return await createOrder(request);
  } catch (error) {
    console.error("Checkout failed", error);
    return NextResponse.json(
      { error: "Unable to place order. Please try again." },
      { status: 500 },
    );
  }
}

async function createOrder(request: Request) {
  const user = await requireCustomerUser();

  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const firstName = readString(body.firstName);
  const lastName = readString(body.lastName);
  const email = user?.email ?? readString(body.email).toLowerCase();
  const dialCode = readString(body.dialCode) || "+91";
  const phone = readString(body.phone);
  const addressLine1 = readString(body.addressLine1);
  const addressLine2 = readString(body.addressLine2);
  const city = readString(body.city);
  const countryCode = readString(body.countryCode) || "IN";
  const stateCode = readString(body.stateCode);
  const countryRecord = Country.getCountryByCode(countryCode);
  const stateRecord = stateCode
    ? State.getStateByCodeAndCountry(stateCode, countryCode)
    : undefined;
  const state = stateRecord?.name ?? readString(body.state);
  const postalCode = readString(body.postalCode);
  const country = countryRecord?.name ?? (readString(body.country) || "India");
  const cityRecords = stateCode ? City.getCitiesOfState(countryCode, stateCode) : [];
  const validCity =
    cityRecords.length === 0 || cityRecords.some((option) => option.name === city);
  const expectedDialCode = countryRecord?.phonecode
    ? `+${countryRecord.phonecode}`
    : dialCode;

  if (
    !firstName ||
    !lastName ||
    !dialCode ||
    !email ||
    !phone ||
    !countryCode ||
    !stateCode ||
    !addressLine1 ||
    !city ||
    !postalCode
  ) {
    return badRequest(
      "First name, last name, email, phone number, country, state, city, address line 1, and zip/postal code are required",
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("A valid email is required");
  }

  if (!countryRecord) {
    return badRequest("Please select a valid country");
  }

  if (!stateRecord) {
    return badRequest("Please select a valid state");
  }

  if (!validCity) {
    return badRequest("Please select a valid city");
  }

  if (!isPostalCodeValid(countryCode, postalCode)) {
    return badRequest(`Postal code is not valid for ${country}`);
  }

  const fullPhone = `${dialCode || expectedDialCode} ${phone}`;

  if (!isValidPhoneNumber(fullPhone, countryCode as CountryCode)) {
    return badRequest(`Mobile number is not valid for ${country}`);
  }

  const cartRows = user
    ? await db
        .select({
          productId: products.id,
          name: products.name,
          image: products.image,
          price: products.price,
          quantity: cartItems.quantity,
          scentOption: cartItems.scentOption,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.userId, user.id))
    : await getGuestCartRows(body.guestItems);

  if (cartRows.length === 0) {
    return badRequest("Your cart is empty");
  }

  const subtotal = cartRows.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const shippingFee = 0;
  const totalAmount = subtotal + shippingFee;

  const order = await db.transaction(async (tx) => {
    const [createdOrder] = await tx
      .insert(orders)
      .values({
        userId: user?.id,
        customerEmail: email,
        customerName: `${firstName} ${lastName}`,
        customerPhone: fullPhone,
        paymentMethod: "CASH_ON_DELIVERY",
        shippingAddress: {
          firstName,
          lastName,
          dialCode: dialCode || expectedDialCode,
          phone,
          fullPhone,
          countryCode,
          stateCode,
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

    await tx.insert(orderItems).values(
      cartRows.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        name: item.name,
        image: item.image,
        scentOption: item.scentOption,
        price: item.price,
        quantity: item.quantity,
      })),
    );

    await tx.insert(orderStatusHistory).values({
      orderId: createdOrder.id,
      status: "PENDING",
      note: "Order placed by customer",
    });

    if (user) {
      await tx.delete(cartItems).where(eq(cartItems.userId, user.id));
    }

    return createdOrder;
  });

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

async function getGuestCartRows(value: unknown) {
  const items = Array.isArray(value)
    ? value
        .map((item) => ({
          productId:
            item && typeof item === "object" && "productId" in item
              ? readString(item.productId)
              : "",
          quantity:
            item && typeof item === "object" && "quantity" in item
              ? normalizeQuantity(item.quantity)
              : 1,
          scentOption:
            item && typeof item === "object" && "scentOption" in item
              ? readString(item.scentOption)
              : "",
        }))
        .filter((item) => item.productId)
    : [];

  if (items.length === 0) {
    return [];
  }

  const productIds = [...new Set(items.map((item) => item.productId))];
  const rows = await db
    .select({
      productId: products.id,
      name: products.name,
      image: products.image,
      price: products.price,
    })
    .from(products)
    .where(and(eq(products.isActive, true), inArray(products.id, productIds)));
  const productById = new Map(rows.map((row) => [row.productId, row]));

  return items.flatMap((item) => {
    const row = productById.get(item.productId);

    if (!row) {
      return [];
    }

    return {
      ...row,
      quantity: item.quantity,
      scentOption: item.scentOption,
    };
  });
}

function normalizeQuantity(value: unknown) {
  const quantity = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return 1;
  }

  return Math.min(quantity, 99);
}
