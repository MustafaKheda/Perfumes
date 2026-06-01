import { and, eq } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, notFound, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { productCollections, products } from "@/lib/db/schema";

type GenerateVariantsBody = {
  force?: unknown;
};

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdminUser();
  if (!admin) return unauthorized("Admin login required");

  const { id } = await context.params;

  let force = false;
  try {
    const body = (await request.json().catch(() => ({}))) as GenerateVariantsBody;
    force = body.force === true;
  } catch {
    // ignore
  }

  const parent = await db.query.products.findFirst({
    where: eq(products.id, id),
  });

  if (!parent) return notFound("Product not found");
  if (parent.parentProductId) {
    return badRequest("Cannot generate variants for a child product");
  }

  const existingChildren = await db.query.products.findMany({
    where: and(eq(products.parentProductId, parent.id), eq(products.isActive, true)),
    columns: { id: true },
    limit: 1,
  });

  if (existingChildren.length > 0 && !force) {
    return ok({ message: "Variants already exist" });
  }

  const smellOptions =
    parent.scentOptions.length > 0
      ? parent.scentOptions
      : parent.notes.length > 0
        ? parent.notes
        : ["Signature"];

  const parentCollectionRows = await db
    .select({ collectionId: productCollections.collectionId })
    .from(productCollections)
    .where(eq(productCollections.productId, parent.id));
  const parentCollectionIds = parentCollectionRows.map((row) => row.collectionId);

  const existingVariantRows = await db
    .select({ slug: products.slug, modelNo: products.modelNo })
    .from(products)
    .where(eq(products.parentProductId, parent.id));
  const usedSlugs = new Set(existingVariantRows.map((row) => row.slug));
  const usedModelNos = new Set(existingVariantRows.map((row) => row.modelNo));

  const createdIds: string[] = [];

  await db.transaction(async (tx) => {
    // Soft delete existing children if force.
    if (force) {
      await tx
        .update(products)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(products.parentProductId, parent.id));
    }

    for (let index = 0; index < smellOptions.length; index++) {
      const smell = smellOptions[index]?.trim();
      if (!smell) continue;

      const variantName = `${parent.name} - ${smell}`;
      const modelSuffix = alphaSuffix(index);
      const modelNoBase = `${parent.modelNo}-${modelSuffix}`;
      const modelNo = ensureUnique(modelNoBase, usedModelNos);
      usedModelNos.add(modelNo);

      const baseSlug = `${parent.slug}-${slugify(smell)}`;
      const slug = ensureUnique(baseSlug, usedSlugs);
      usedSlugs.add(slug);

      const [child] = await tx
        .insert(products)
        .values({
          name: variantName,
          modelNo,
          slug,
          description: parent.description,
          detailedDescription: parent.detailedDescription,
          productDetailHtml: parent.productDetailHtml,
          seoUrl: `/products/${slug}`,
          seoTitle: `${variantName} Perfume | Scentora`,
          seoDescription: parent.seoDescription,
          seoKeywords: parent.seoKeywords,
          googleShoppingDescription: parent.googleShoppingDescription,
          image: parent.image,
          imagePublicId: parent.imagePublicId,
          purchasePrice: Number(parent.purchasePrice).toFixed(2),
          price: Number(parent.price).toFixed(2),
          stock: parent.stock,
          brand: parent.brand,
          tag: parent.tag,
          notes: parent.notes,
          scentOptions: [],
          isBestSeller: false,
          isFeatured: false,
          isActive: true,
          parentProductId: parent.id,
          categoryId: parent.categoryId,
        })
        .returning({ id: products.id });

      createdIds.push(child.id);

      if (parentCollectionIds.length > 0) {
        await tx
          .insert(productCollections)
          .values(
            parentCollectionIds.map((collectionId) => ({
              productId: child.id,
              collectionId,
            })),
          )
          .onConflictDoNothing();
      }
    }
  });

  return ok({
    message: createdIds.length > 0 ? "Variants generated" : "No variants generated",
    meta: { created: createdIds.length },
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function alphaSuffix(index: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (index < alphabet.length) return alphabet[index]!;
  const first = alphabet[Math.floor(index / alphabet.length) - 1] ?? "A";
  const second = alphabet[index % alphabet.length] ?? "A";
  return `${first}${second}`;
}

function ensureUnique(base: string, used: Set<string>) {
  if (!used.has(base)) return base;
  for (let i = 2; i < 200; i++) {
    const candidate = `${base}-${i}`;
    if (!used.has(candidate)) return candidate;
  }
  return `${base}-${Date.now()}`;
}
