import { eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, notFound, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";

type UpdateBody = {
  modelNo?: unknown;
  name?: unknown;
  image?: unknown;
  price?: unknown;
  stock?: unknown;
  isActive?: unknown;
};

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminUser();
  if (!admin) return unauthorized("Admin login required");
  const { id } = await context.params;

  let body: UpdateBody;
  try {
    body = (await request.json()) as UpdateBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof body.modelNo === "string" && body.modelNo.trim()) updates.modelNo = body.modelNo.trim().toUpperCase();
  if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();
  if (typeof body.image === "string" && body.image.trim()) updates.image = body.image.trim();
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) return badRequest("Invalid price");
    updates.price = price.toFixed(2);
  }
  if (body.stock !== undefined) {
    const stock = Number(body.stock);
    if (!Number.isInteger(stock) || stock < 0) return badRequest("Invalid stock");
    updates.stock = stock;
  }
  if (typeof body.isActive === "boolean") updates.isActive = body.isActive;

  const updated = await db.update(products).set(updates).where(eq(products.id, id)).returning({ id: products.id });
  if (updated.length === 0) return notFound("Product not found");
  return ok({ message: "Product updated" });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminUser();
  if (!admin) return unauthorized("Admin login required");
  const { id } = await context.params;

  const updated = await db
    .update(products)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning({ id: products.id });
  if (updated.length === 0) return notFound("Product not found");
  return ok({ message: "Product soft deleted" });
}
