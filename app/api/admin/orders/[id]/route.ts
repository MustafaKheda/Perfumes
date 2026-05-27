import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, notFound, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import {
  orderStatusHistory,
  orderStatusValues,
  orders,
  paymentStatusValues,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/db/schema";
import { sendOrderStatusEmail } from "@/lib/email";
import { sendOrderStatusSms } from "@/lib/sms";

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

  const updated = await db.transaction(async (tx) => {
    const currentOrder = await tx.query.orders.findFirst({
      where: eq(orders.id, id),
      columns: {
        id: true,
        status: true,
        customerEmail: true,
        customerName: true,
        customerPhone: true,
      },
    });

    if (!currentOrder) {
      return null;
    }

    const [updatedOrder] = await tx
      .update(orders)
      .set({
        ...(status ? { status } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning({ id: orders.id });

    if (status && status !== currentOrder.status) {
      await tx.insert(orderStatusHistory).values({
        orderId: id,
        status,
        note: statusNote(status),
        changedByAdminId: admin.id,
      });
    }

    return {
      id: updatedOrder.id,
      previousStatus: currentOrder.status,
      statusChanged: Boolean(status && status !== currentOrder.status),
      customerEmail: currentOrder.customerEmail,
      customerName: currentOrder.customerName,
      customerPhone: currentOrder.customerPhone,
      newStatus: status,
    };
  });

  if (!updated) {
    return notFound("Order not found");
  }

  const order = await findOrderById(updated.id);

  if (!order) {
    return notFound("Order not found");
  }

  if (updated.statusChanged && updated.newStatus) {
    await notifyCustomerAboutOrderStatus({
      orderId: updated.id,
      customerEmail: updated.customerEmail,
      customerName: updated.customerName,
      customerPhone: updated.customerPhone,
      status: updated.newStatus,
      note: statusNote(updated.newStatus),
    });
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
      statusHistory: {
        orderBy: (table, { asc }) => [asc(table.createdAt)],
      },
    },
  });
}

async function notifyCustomerAboutOrderStatus({
  orderId,
  customerEmail,
  customerName,
  customerPhone,
  status,
  note,
}: {
  orderId: string;
  customerEmail: string;
  customerName: string | null;
  customerPhone: string | null;
  status: OrderStatus;
  note: string;
}) {
  const tasks: Array<Promise<unknown>> = [
    sendOrderStatusEmail({
      to: customerEmail,
      customerName,
      orderId,
      status,
      note,
    }),
  ];

  if (customerPhone) {
    tasks.push(
      sendOrderStatusSms({
        to: customerPhone,
        orderId,
        status,
        note,
      }),
    );
  }

  const results = await Promise.allSettled(tasks);
  const failed = results.filter((result) => result.status === "rejected");

  if (failed.length > 0) {
    console.error("Order status notification failed", {
      orderId,
      status,
      failures: failed.map((result) =>
        result.status === "rejected" && result.reason instanceof Error
          ? result.reason.message
          : "Unknown notification error",
      ),
    });
  }
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
      scentOption: string | null;
      price: string;
      quantity: number;
    }>;
    statusHistory: Array<{
      id: string;
      status: OrderStatus;
      note: string | null;
      changedByAdminId: string | null;
      createdAt: Date;
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
    paymentMethod: order.paymentMethod,
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
      scentOption: item.scentOption,
      price: Number(item.price),
      quantity: item.quantity,
    })),
    statusHistory: order.statusHistory.map((entry) => ({
      id: entry.id,
      status: entry.status,
      note: entry.note,
      changedByAdminId: entry.changedByAdminId,
      createdAt: entry.createdAt.toISOString(),
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

function statusNote(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "Order marked as pending";
    case "CONFIRMED":
      return "Order confirmed";
    case "SHIPPED":
      return "Order shipped";
    case "DELIVERED":
      return "Order delivered";
    case "CANCELLED":
      return "Order cancelled";
    case "REFUNDED":
      return "Order refunded";
    default:
      return `Order status changed to ${status}`;
  }
}
