import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, notFound, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import {
  orderStatusValues,
  orders,
  paymentStatusValues,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateOrderBody = {
  status?: unknown;
  paymentStatus?: unknown;
};

export async function GET(_request: Request, context: RouteContext) {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const { id } = await context.params;
  const order = await findOrderById(id);

  if (!order) {
    return notFound("Order not found");
  }

  return ok({ data: serializeOrder(order) });
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const { id } = await context.params;
  let body: UpdateOrderBody;

  try {
    body = (await request.json()) as UpdateOrderBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const status = parseOrderStatus(body.status);
  const paymentStatus = parsePaymentStatus(body.paymentStatus);

  if (body.status !== undefined && !status) {
    return badRequest("Invalid order status");
  }

  if (body.paymentStatus !== undefined && !paymentStatus) {
    return badRequest("Invalid payment status");
  }

  if (!status && !paymentStatus) {
    return badRequest("At least one of status or paymentStatus is required");
  }

  const [updated] = await db
    .update(orders)
    .set({
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning({ id: orders.id });

  if (!updated) {
    return notFound("Order not found");
  }

  const order = await findOrderById(updated.id);

  if (!order) {
    return notFound("Order not found");
  }

  return ok({
    message: "Order updated",
    data: serializeOrder(order),
  });
}

async function findOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: true,
    },
  });
}

function parseOrderStatus(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.toUpperCase() as OrderStatus;
  if (orderStatusValues.includes(normalized)) {
    return normalized;
  }

  return null;
}

function parsePaymentStatus(value: unknown) {
  if (typeof value !== "string") {
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
