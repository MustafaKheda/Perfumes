import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { notFound, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { buildInvoiceHtml } from "@/lib/invoice";
import { sendInvoiceEmail } from "@/lib/email";
import { orders } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function findOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      items: true,
    },
  });
}

export async function GET(_request: Request, context: RouteContext) {
  const admin = await requireAdminUser();
  if (!admin) return unauthorized("Admin login required");

  const { id } = await context.params;
  const order = await findOrderById(id);
  if (!order) return notFound("Order not found");

  const html = buildInvoiceHtml({
    orderId: order.id,
    createdAt: order.createdAt,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    paymentMethod: order.paymentMethod,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    totalAmount: Number(order.totalAmount),
    shippingAddress: order.shippingAddress,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price),
      scentOption: item.scentOption || null,
    })),
  });

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

export async function POST(_request: Request, context: RouteContext) {
  const admin = await requireAdminUser();
  if (!admin) return unauthorized("Admin login required");

  const { id } = await context.params;
  const order = await findOrderById(id);
  if (!order) return notFound("Order not found");

  const html = buildInvoiceHtml({
    orderId: order.id,
    createdAt: order.createdAt,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    paymentMethod: order.paymentMethod,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    totalAmount: Number(order.totalAmount),
    shippingAddress: order.shippingAddress,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price),
      scentOption: item.scentOption || null,
    })),
  });

  await sendInvoiceEmail({
    to: order.customerEmail,
    customerName: order.customerName,
    orderId: order.id,
    html,
  });

  return ok({ message: "Invoice sent" });
}

