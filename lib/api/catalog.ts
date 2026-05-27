import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "@/lib/db";
import {
  categories,
  collections,
  productCollections,
  products,
  productTagValues,
  type ProductTag,
} from "@/lib/db/schema";

export type ProductSort = "newest" | "price_asc" | "price_desc" | "name_asc";

export type ProductQuery = {
  category?: string | null;
  collection?: string | null;
  search?: string | null;
  tag?: string | null;
  bestSeller?: string | null;
  featured?: string | null;
  sort?: string | null;
  page?: string | null;
  limit?: string | null;
};

type ProductRow = typeof products.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;
type CollectionRow = typeof collections.$inferSelect;

type ProductWithRelations = ProductRow & {
  category: CategoryRow;
  collections: CollectionRow[];
};

export async function getProducts(query: ProductQuery) {
  const page = parsePositiveInt(query.page, 1);
  const limit = Math.min(parsePositiveInt(query.limit, 12), 50);
  const sort = normalizeSort(query.sort);
  const where = await buildProductWhere(query);

  const [items, totalResult] = await Promise.all([
    db
      .select({
        product: products,
        category: categories,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(getProductOrderBy(sort))
      .offset((page - 1) * limit)
      .limit(limit),
    db.select({ value: count() }).from(products).where(where),
  ]);

  const productIds = items.map((item) => item.product.id);
  const collectionRows =
    productIds.length > 0
      ? await db
          .select({
            productId: productCollections.productId,
            collection: collections,
          })
          .from(productCollections)
          .innerJoin(collections, eq(productCollections.collectionId, collections.id))
          .where(inArray(productCollections.productId, productIds))
          .orderBy(asc(collections.displayOrder), asc(collections.name))
      : [];
  const collectionsByProduct = groupCollectionsByProduct(collectionRows);
  const total = totalResult[0]?.value ?? 0;
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    data: items.map((item) =>
      serializeProduct({
        ...item.product,
        category: item.category,
        collections: collectionsByProduct.get(item.product.id) ?? [],
      }),
    ),
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function findProductByIdOrSlug(idOrSlug: string) {
  const productIdentifier = isUuid(idOrSlug)
    ? or(eq(products.id, idOrSlug), eq(products.slug, idOrSlug))
    : eq(products.slug, idOrSlug);
  const [row] = await db
    .select({
      product: products,
      category: categories,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        productIdentifier,
      ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  const collectionRows = await db
    .select({
      collection: collections,
    })
    .from(productCollections)
    .innerJoin(collections, eq(productCollections.collectionId, collections.id))
    .where(eq(productCollections.productId, row.product.id))
    .orderBy(asc(collections.displayOrder), asc(collections.name));

  return serializeProduct({
    ...row.product,
    category: row.category,
    collections: collectionRows.map((item) => item.collection),
  });
}

export async function getCategories() {
  const items = await db.select().from(categories).orderBy(asc(categories.name));

  return {
    data: items.map(serializeCategory),
    meta: {
      total: items.length,
    },
  };
}

export async function findCategoryBySlug(slug: string) {
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  return category ? serializeCategory(category) : null;
}

export async function getCollections() {
  const items = await db
    .select()
    .from(collections)
    .orderBy(asc(collections.displayOrder), asc(collections.name));

  return {
    data: items.map(serializeCollection),
    meta: {
      total: items.length,
    },
  };
}

export async function findCollectionBySlug(slug: string) {
  const collection = await db.query.collections.findFirst({
    where: eq(collections.slug, slug),
  });

  return collection ? serializeCollection(collection) : null;
}

async function buildProductWhere(query: ProductQuery) {
  const filters: SQL[] = [eq(products.isActive, true)];

  if (query.category && query.category !== "all") {
    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, query.category),
      columns: { id: true },
    });

    filters.push(category ? eq(products.categoryId, category.id) : sql`false`);
  }

  if (query.collection && query.collection !== "all") {
    const collection = await db.query.collections.findFirst({
      where: eq(collections.slug, query.collection),
      columns: { id: true },
    });

    if (!collection) {
      filters.push(sql`false`);
    } else {
      filters.push(
        sql`exists (
          select 1
          from ${productCollections}
          where ${productCollections.productId} = ${products.id}
          and ${productCollections.collectionId} = ${collection.id}
        )`,
      );
    }
  }

  const tag = normalizeTag(query.tag);

  if (tag) {
    filters.push(eq(products.tag, tag));
  }

  if (query.bestSeller === "true") {
    filters.push(eq(products.isBestSeller, true));
  }

  if (query.featured === "true") {
    filters.push(eq(products.isFeatured, true));
  }

  if (query.search) {
    const search = query.search.trim();

    if (search) {
      filters.push(
        or(
          ilike(products.name, `%${search}%`),
          ilike(products.description, `%${search}%`),
          sql`${products.notes} @> ARRAY[${search}]::text[]`,
        )!,
      );
    }
  }

  return and(...filters);
}

function getProductOrderBy(sort: ProductSort) {
  if (sort === "price_asc") {
    return asc(products.price);
  }

  if (sort === "price_desc") {
    return desc(products.price);
  }

  if (sort === "name_asc") {
    return asc(products.name);
  }

  return desc(products.createdAt);
}

function normalizeSort(sort?: string | null): ProductSort {
  if (
    sort === "price_asc" ||
    sort === "price_desc" ||
    sort === "name_asc" ||
    sort === "newest"
  ) {
    return sort;
  }

  return "newest";
}

function normalizeTag(tag?: string | null) {
  if (!tag) {
    return null;
  }

  const normalized = tag.toUpperCase() as ProductTag;

  if (productTagValues.includes(normalized)) {
    return normalized;
  }

  return null;
}

function groupCollectionsByProduct(
  rows: Array<{ productId: string; collection: CollectionRow }>,
) {
  const map = new Map<string, CollectionRow[]>();

  for (const row of rows) {
    const existing = map.get(row.productId) ?? [];
    existing.push(row.collection);
    map.set(row.productId, existing);
  }

  return map;
}

function serializeProduct(product: ProductWithRelations) {
  return {
    id: product.id,
    slug: product.slug,
    image: product.image,
    name: product.name,
    description: product.description,
    detailedDescription: product.detailedDescription,
    productDetailHtml: product.productDetailHtml,
    notes: product.notes,
    scentOptions: product.scentOptions,
    price: Number(product.price),
    tag: product.tag,
    category: product.category.slug,
    categoryDetails: serializeCategory(product.category),
    collections: product.collections.map((item) => item.slug),
    collectionDetails: product.collections.map(serializeCollection),
    stock: product.stock,
    isBestSeller: product.isBestSeller,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function serializeCategory(category: CategoryRow) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

function serializeCollection(collection: CollectionRow) {
  return {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description,
    image: collection.image,
    images: collection.images,
    countLabel: collection.countLabel,
    displayOrder: collection.displayOrder,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  };
}

function parsePositiveInt(value: string | null | undefined, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
