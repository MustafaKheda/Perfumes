import { and, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import {
  orderStatusValues,
  orders,
  paymentStatusValues,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/db/schema";

export async function GET(request: Request) {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const { searchParams } = new URL(request.url);
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = Math.min(parsePositiveInt(searchParams.get("limit"), 20), 100);
  const status = parseOrderStatus(searchParams.get("status"));
  const paymentStatus = parsePaymentStatus(searchParams.get("paymentStatus"));
  const query = searchParams.get("q")?.trim();

  if (searchParams.get("status") && !status) {
    return badRequest("Invalid order status");
  }

  if (searchParams.get("paymentStatus") && !paymentStatus) {
    return badRequest("Invalid payment status");
  }

  const where = buildOrderWhere({ status, paymentStatus, query });
  const [items, totalResult] = await Promise.all([
    db.query.orders.findMany({
      where,
      with: {
        items: true,
      },
      orderBy: desc(orders.createdAt),
      offset: (page - 1) * limit,
      limit,
    }),
    db.select({ value: count() }).from(orders).where(where),
  ]);
  const total = totalResult[0]?.value ?? 0;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return ok({
    data: items.map(serializeOrder),
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
}

function buildOrderWhere({
  paymentStatus,
  query,
  status,
}: {
  paymentStatus: PaymentStatus | null;
  query?: string;
  status: OrderStatus | null;
}) {
  const filters: SQL[] = [];

  if (status) {
    filters.push(eq(orders.status, status));
  }

  if (paymentStatus) {
    filters.push(eq(orders.paymentStatus, paymentStatus));
  }

  if (query) {
    filters.push(
      or(
        sql`cast(${orders.id} as text) ilike ${`%${query}%`}`,
        ilike(orders.customerEmail, `%${query}%`),
        ilike(orders.customerName, `%${query}%`),
      )!,
    );
  }

  return filters.length > 0 ? and(...filters) : undefined;
}

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

function parseOrderStatus(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.toUpperCase() as OrderStatus;
  if (orderStatusValues.includes(normalized)) {
    return normalized;
  }

  return null;
}

function parsePaymentStatus(value: string | null) {
  if (!value) {
    return null;
  }

  const normalized = value.toUpperCase() as PaymentStatus;
  if (paymentStatusValues.includes(normalized)) {
    return normalized;
  }

  return null;
}

function serializeOrder(
  order: typeof orders.$inferSelect & {
    items: Array<{
      id: string;
      productId: string;
      name: string;
      image: string;
      price: string;
      quantity: number;
    }>;
  },
) {
  return {
    id: order.id,
    userId: order.userId,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    totalAmount: Number(order.totalAmount),
    status: order.status,
    paymentStatus: order.paymentStatus,
    items: order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      image: item.image,
      price: Number(item.price),
      quantity: item.quantity,
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
