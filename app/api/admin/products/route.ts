import { desc, eq, inArray } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import {
  categories,
  collections,
  productCollections,
  products,
  productTagValues,
  type ProductTag,
} from "@/lib/db/schema";

type CreateProductBody = {
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  image?: unknown;
  imagePublicId?: unknown;
  price?: unknown;
  stock?: unknown;
  tag?: unknown;
  notes?: unknown;
  isBestSeller?: unknown;
  isFeatured?: unknown;
  isActive?: unknown;
  categoryId?: unknown;
  collectionIds?: unknown;
};

type ProductWithRelations = NonNullable<
  Awaited<ReturnType<typeof findAdminProductById>>
>;

export async function GET() {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const items = await db.query.products.findMany({
    with: {
      category: true,
      collections: {
        with: {
          collection: true,
        },
      },
    },
    orderBy: desc(products.createdAt),
    limit: 100,
  });

  return ok({
    data: items.map(serializeProduct),
    meta: {
      total: items.length,
    },
  });
}

export async function POST(request: Request) {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  let body: CreateProductBody;

  try {
    body = (await request.json()) as CreateProductBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const name = toNonEmptyString(body.name);
  const description = toNonEmptyString(body.description);
  const image = toNonEmptyString(body.image);
  const categoryId = toNonEmptyString(body.categoryId);
  const slug = normalizeSlug(body.slug, name);
  const price = toPrice(body.price);
  const stock = toInteger(body.stock);
  const tag = toTag(body.tag);
  const notes = toStringArray(body.notes);
  const imagePublicId = toOptionalString(body.imagePublicId);
  const collectionIds = toCollectionIds(body.collectionIds);
  const isBestSeller = toBoolean(body.isBestSeller, false);
  const isFeatured = toBoolean(body.isFeatured, false);
  const isActive = toBoolean(body.isActive, true);

  if (!name || !description || !image || !categoryId || !slug) {
    return badRequest(
      "name, description, image, categoryId and slug (or valid name) are required",
    );
  }

  if (price === null || stock === null) {
    return badRequest("price and stock must be valid numbers");
  }

  const category = await db.query.categories.findFirst({
    where: eq(categories.id, categoryId),
    columns: { id: true },
  });

  if (!category) {
    return badRequest("Invalid categoryId");
  }

  if (collectionIds.length > 0) {
    const existingCollections = await db
      .select({ id: collections.id })
      .from(collections)
      .where(inArray(collections.id, collectionIds));

    if (existingCollections.length !== collectionIds.length) {
      return badRequest("One or more collectionIds are invalid");
    }
  }

  try {
    const [created] = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(products)
        .values({
          name,
          slug,
          description,
          image,
          imagePublicId,
          price: price.toFixed(2),
          stock,
          tag,
          notes,
          isBestSeller,
          isFeatured,
          isActive,
          categoryId,
        })
        .returning({ id: products.id });

      if (collectionIds.length > 0) {
        await tx.insert(productCollections).values(
          collectionIds.map((collectionId) => ({
            productId: inserted[0].id,
            collectionId,
          })),
        );
      }

      return inserted;
    });

    const product = await findAdminProductById(created.id);

    if (!product) {
      throw new Error("Created product could not be loaded");
    }

    return ok(
      {
        message: "Product created",
        data: serializeProduct(product),
      },
      { status: 201 },
    );
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return badRequest("A product with this slug already exists");
    }

    throw error;
  }
}

async function findAdminProductById(id: string) {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      collections: {
        with: {
          collection: true,
        },
      },
    },
  });
}

function serializeProduct(product: ProductWithRelations) {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.image,
    price: Number(product.price),
    stock: product.stock,
    tag: product.tag,
    notes: product.notes,
    isBestSeller: product.isBestSeller,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    collections: product.collections.map((item) => ({
      id: item.collection.id,
      name: item.collection.name,
      slug: item.collection.slug,
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function toNonEmptyString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeSlug(rawSlug: unknown, rawName: string | null) {
  const source = toNonEmptyString(rawSlug) ?? rawName;

  if (!source) {
    return null;
  }

  const slug = source
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return slug.length > 0 ? slug : null;
}

function toPrice(value: unknown) {
  const price = typeof value === "number" ? value : Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

function toInteger(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
}

function toTag(value: unknown): ProductTag | null {
  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const normalized = value.toUpperCase() as ProductTag;

  if (productTagValues.includes(normalized)) {
    return normalized;
  }

  return null;
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);
}

function toCollectionIds(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.filter((item): item is string => typeof item === "string"))];
}

function toBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}
