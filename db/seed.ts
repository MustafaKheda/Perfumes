import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";
import { eq } from "drizzle-orm";
import {
  categories,
  collections,
  productCollections,
  products,
  users,
  type ProductTag,
} from "@/lib/db/schema";

const categorySeeds = [
  {
    name: "Men's Fragrances",
    slug: "men",
    description: "Bold, refined fragrances crafted for daily confidence.",
  },
  {
    name: "Women's Fragrances",
    slug: "women",
    description: "Elegant florals, soft musks, and expressive signature scents.",
  },
  {
    name: "Unisex Scents",
    slug: "unisex",
    description: "Balanced fragrances made for every style and occasion.",
  },
];

const collectionSeeds = [
  {
    name: "All Collection",
    slug: "all",
    description: "Explore every Scentora fragrance in one place.",
    countLabel: "All Products",
    displayOrder: 0,
    images: [
      "/images/Perfume/34.webp",
      "/images/Perfume/26.webp",
      "/images/Perfume/18.webp",
      "/images/Perfume/30.webp",
    ],
  },
  {
    name: "Men's Collection",
    slug: "men",
    description: "Rich, long-lasting fragrances with oud, amber, and woods.",
    countLabel: "120+ Products",
    displayOrder: 1,
    images: [
      "/images/Perfume/34.webp",
      "/images/Perfume/26.webp",
      "/images/Perfume/33.jpg",
      "/images/Perfume/25.webp",
    ],
  },
  {
    name: "Women's Collection",
    slug: "women",
    description: "Soft florals, vanilla warmth, and polished everyday scents.",
    countLabel: "140+ Products",
    displayOrder: 2,
    images: [
      "/images/Perfume/18.webp",
      "/images/Perfume/30.webp",
      "/images/Perfume/35.webp",
      "/images/Perfume/21.webp",
    ],
  },
  {
    name: "Unisex Collection",
    slug: "unisex",
    description: "Modern fragrances built around balance and versatility.",
    countLabel: "90+ Products",
    displayOrder: 3,
    images: [
      "/images/Perfume/9.webp",
      "/images/Perfume/31.webp",
      "/images/Perfume/35.webp",
      "/images/Perfume/20.webp",
    ],
  },
  {
    name: "Luxury Collection",
    slug: "luxury",
    description: "Premium scents with refined ingredients and lasting depth.",
    countLabel: "340+ Products",
    displayOrder: 4,
    images: [
      "/images/Perfume/32.webp",
      "/images/Perfume/37.webp",
      "/images/Perfume/31.webp",
      "/images/Perfume/36.webp",
    ],
  },
];

const productSeeds = [
  {
    slug: "noir-mystique",
    image: "/images/Perfume/1.webp",
    name: "Noir Mystique",
    description: "A deep, polished scent built around oud, bergamot, and amber.",
    notes: ["Oud", "Bergamot", "Amber"],
    price: "120.00",
    tag: "HOT",
    categorySlug: "men",
    collectionSlugs: ["men", "luxury"],
    stock: 25,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    slug: "velvet-bloom",
    image: "/images/Perfume/2.webp",
    name: "Velvet Bloom",
    description: "A soft floral blend of rose, vanilla, and clean musk.",
    notes: ["Rose", "Vanilla", "Musk"],
    price: "135.00",
    tag: "HOT",
    categorySlug: "women",
    collectionSlugs: ["women", "luxury"],
    stock: 32,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    slug: "amber-dusk",
    image: "/images/Perfume/9.webp",
    name: "Amber Dusk",
    description: "Warm amber and cedarwood balanced with a bright jasmine heart.",
    notes: ["Amber", "Cedarwood", "Jasmine"],
    price: "110.00",
    tag: "NEW",
    categorySlug: "unisex",
    collectionSlugs: ["unisex"],
    stock: 18,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    slug: "cedar-amber",
    image: "/images/Perfume/31.webp",
    name: "Cedar Amber",
    description: "A structured men's fragrance with cedarwood and amber depth.",
    notes: ["Amber", "Cedarwood", "Jasmine"],
    price: "110.00",
    tag: "NEW",
    categorySlug: "men",
    collectionSlugs: ["men"],
    stock: 21,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    slug: "saffron-mist",
    image: "/images/Perfume/35.webp",
    name: "Saffron Mist",
    description: "A smooth unisex scent with warm spice and soft woods.",
    notes: ["Saffron", "Amber", "Sandalwood"],
    price: "110.00",
    tag: "NEW",
    categorySlug: "unisex",
    collectionSlugs: ["unisex", "luxury"],
    stock: 16,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    slug: "oud-ember",
    image: "/images/Perfume/18.webp",
    name: "Oud Ember",
    description: "Smoky oud with bergamot lift and amber warmth.",
    notes: ["Oud", "Bergamot", "Amber"],
    price: "120.00",
    tag: "HOT",
    categorySlug: "men",
    collectionSlugs: ["men", "luxury"],
    stock: 28,
    isBestSeller: true,
    isFeatured: false,
  },
  {
    slug: "rose-velour",
    image: "/images/Perfume/30.webp",
    name: "Rose Velour",
    description: "Rose and vanilla over a gentle musk base.",
    notes: ["Rose", "Vanilla", "Musk"],
    price: "135.00",
    tag: "HOT",
    categorySlug: "women",
    collectionSlugs: ["women"],
    stock: 30,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    slug: "floral-noir",
    image: "/images/Perfume/7.webp",
    name: "Floral Noir",
    description: "A feminine floral scent with a deeper amber finish.",
    notes: ["Oud", "Bergamot", "Amber"],
    price: "120.00",
    tag: "HOT",
    categorySlug: "women",
    collectionSlugs: ["women"],
    stock: 24,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    slug: "golden-noir",
    image: "/images/Perfume/37.webp",
    name: "Golden Noir",
    description: "A bold women's scent with amber, bergamot, and oud.",
    notes: ["Oud", "Bergamot", "Amber"],
    price: "120.00",
    tag: "HOT",
    categorySlug: "women",
    collectionSlugs: ["women", "luxury"],
    stock: 14,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    slug: "musk-bloom",
    image: "/images/Perfume/32.webp",
    name: "Musk Bloom",
    description: "Rose, vanilla, and musk in a smooth premium profile.",
    notes: ["Rose", "Vanilla", "Musk"],
    price: "135.00",
    tag: "HOT",
    categorySlug: "women",
    collectionSlugs: ["women", "luxury"],
    stock: 19,
    isBestSeller: true,
    isFeatured: false,
  },
  {
    slug: "midnight-amber",
    image: "/images/Perfume/20.webp",
    name: "Midnight Amber",
    description: "A warm evening fragrance with amber, vanilla, and sandalwood.",
    notes: ["Amber", "Vanilla", "Sandalwood"],
    price: "110.00",
    tag: "POPULAR",
    categorySlug: "men",
    collectionSlugs: ["men"],
    stock: 25,
    isBestSeller: true,
    isFeatured: false,
  },
] satisfies Array<{
  slug: string;
  image: string;
  name: string;
  description: string;
  notes: string[];
  price: string;
  tag: ProductTag;
  categorySlug: string;
  collectionSlugs: string[];
  stock: number;
  isBestSeller: boolean;
  isFeatured: boolean;
}>;

async function main() {
  loadEnv();
  const { db, sqlClient } = await import("@/lib/db");
  const categoryBySlug = new Map<string, string>();
  const collectionBySlug = new Map<string, string>();

  try {
    for (const category of categorySeeds) {
      const [row] = await db
        .insert(categories)
        .values(category)
        .onConflictDoUpdate({
          target: categories.slug,
          set: {
            name: category.name,
            description: category.description,
            updatedAt: new Date(),
          },
        })
        .returning({ id: categories.id, slug: categories.slug });

      categoryBySlug.set(row.slug, row.id);
    }

    for (const collection of collectionSeeds) {
      const [row] = await db
        .insert(collections)
        .values(collection)
        .onConflictDoUpdate({
          target: collections.slug,
          set: {
            name: collection.name,
            description: collection.description,
            countLabel: collection.countLabel,
            displayOrder: collection.displayOrder,
            images: collection.images,
            updatedAt: new Date(),
          },
        })
        .returning({ id: collections.id, slug: collections.slug });

      collectionBySlug.set(row.slug, row.id);
    }

    for (const product of productSeeds) {
      const categoryId = categoryBySlug.get(product.categorySlug);

      if (!categoryId) {
        throw new Error(`Missing category ${product.categorySlug}`);
      }

      const [row] = await db
        .insert(products)
        .values({
          name: product.name,
          slug: product.slug,
          description: product.description,
          image: product.image,
          price: product.price,
          tag: product.tag,
          notes: product.notes,
          stock: product.stock,
          isBestSeller: product.isBestSeller,
          isFeatured: product.isFeatured,
          isActive: true,
          categoryId,
        })
        .onConflictDoUpdate({
          target: products.slug,
          set: {
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
            tag: product.tag,
            notes: product.notes,
            stock: product.stock,
            isBestSeller: product.isBestSeller,
            isFeatured: product.isFeatured,
            isActive: true,
            categoryId,
            updatedAt: new Date(),
          },
        })
        .returning({ id: products.id });

      await db
        .delete(productCollections)
        .where(eq(productCollections.productId, row.id));

      for (const collectionSlug of product.collectionSlugs) {
        const collectionId = collectionBySlug.get(collectionSlug);

        if (!collectionId) {
          throw new Error(`Missing collection ${collectionSlug}`);
        }

        await db
          .insert(productCollections)
          .values({
            productId: row.id,
            collectionId,
          })
          .onConflictDoNothing();
      }
    }

    const adminEmail = process.env.ADMIN_EMAIL || "admin@scentora.local";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "Scentora Admin";

    await db
      .insert(users)
      .values({
        name: adminName,
        email: adminEmail,
        role: "ADMIN",
        passwordHash: hashPassword(adminPassword),
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: adminName,
          role: "ADMIN",
          passwordHash: hashPassword(adminPassword),
          updatedAt: new Date(),
        },
      });
  } finally {
    await sqlClient.end();
  }
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const key = scryptSync(password, salt, 64).toString("base64url");

  return `scrypt:${salt}:${key}`;
}

function loadEnv() {
  const content = readFileSync(".env", "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex);
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    process.env[key] ??= value;
  }
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
