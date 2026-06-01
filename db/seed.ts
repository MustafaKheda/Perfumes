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
    modelNo: "SCT-001",
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
    modelNo: "SCT-002",
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
    modelNo: "SCT-003",
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
    modelNo: "SCT-004",
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
    modelNo: "SCT-005",
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
    modelNo: "SCT-006",
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
    modelNo: "SCT-007",
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
    modelNo: "SCT-008",
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
    modelNo: "SCT-009",
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
    modelNo: "SCT-010",
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
    modelNo: "SCT-011",
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
  {
    modelNo: "SCT-012",
    slug: "inferno-spice",
    image: "/images/Perfume/33.jpg",
    name: "Inferno Spice",
    description:
      "A bold spicy profile with clove and saffron over smoky vetiver woods.",
    notes: ["Clove", "Saffron", "Vetiver"],
    price: "129.00",
    tag: "HOT",
    categorySlug: "men",
    collectionSlugs: ["men", "luxury"],
    stock: 22,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    modelNo: "SCT-013",
    slug: "marine-adventure",
    image: "/images/Perfume/34.webp",
    name: "Marine Adventure",
    description:
      "Fresh citrus and aromatic saffron layered on clean musk and moss.",
    notes: ["Citrus", "Saffron", "Musk"],
    price: "105.00",
    tag: "NEW",
    categorySlug: "unisex",
    collectionSlugs: ["unisex", "all"],
    stock: 26,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    modelNo: "SCT-014",
    slug: "twin-paradise",
    image: "/images/Perfume/18.webp",
    name: "Twin Paradise",
    description:
      "Tropical floral accord with orange blossom and creamy sandalwood vanilla.",
    notes: ["Orange Blossom", "Tuberose", "Sandalwood"],
    price: "149.00",
    tag: "POPULAR",
    categorySlug: "women",
    collectionSlugs: ["women", "luxury"],
    stock: 20,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    modelNo: "SCT-015",
    slug: "french-vanilla-reserve",
    image: "/images/Perfume/30.webp",
    name: "French Vanilla Reserve",
    description:
      "A warm aromatic blend of vanilla, musk, and dry woods with spiced lift.",
    notes: ["Vanilla", "Musk", "Dry Woods"],
    price: "119.00",
    tag: "POPULAR",
    categorySlug: "unisex",
    collectionSlugs: ["unisex", "luxury"],
    stock: 29,
    isBestSeller: true,
    isFeatured: false,
  },
  {
    modelNo: "SCT-016",
    slug: "magnolia-silk",
    image: "/images/Perfume/35.webp",
    name: "Magnolia Silk",
    description:
      "Soft floral elegance built around jasmine and lily of the valley.",
    notes: ["Lily of the Valley", "Jasmine", "Musk"],
    price: "125.00",
    tag: "NEW",
    categorySlug: "women",
    collectionSlugs: ["women", "all"],
    stock: 24,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    modelNo: "SCT-017",
    slug: "nicolai-leather",
    image: "/images/Perfume/37.webp",
    name: "Nicolai Leather",
    description:
      "Refined leather and osmanthus with a woody musky dry down.",
    notes: ["Osmanthus", "Leather", "Woods"],
    price: "159.00",
    tag: "LUXURY",
    categorySlug: "unisex",
    collectionSlugs: ["unisex", "luxury"],
    stock: 17,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    modelNo: "SCT-018",
    slug: "torando-chypre",
    image: "/images/Perfume/31.webp",
    name: "Torando Chypre",
    description:
      "Vibrant fruit opening with patchouli and oakmoss for a modern chypre trail.",
    notes: ["Grapefruit", "Patchouli", "Oakmoss"],
    price: "139.00",
    tag: "HOT",
    categorySlug: "unisex",
    collectionSlugs: ["unisex", "all"],
    stock: 23,
    isBestSeller: true,
    isFeatured: false,
  },
  {
    modelNo: "SCT-019",
    slug: "aura-amber",
    image: "/images/Perfume/20.webp",
    name: "Aura Amber",
    description:
      "Bright bergamot opening with powdery heart and amber sandalwood base.",
    notes: ["Bergamot", "Orris", "Sandalwood"],
    price: "128.00",
    tag: "POPULAR",
    categorySlug: "men",
    collectionSlugs: ["men", "all"],
    stock: 27,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    modelNo: "SCT-020",
    slug: "divine-blush",
    image: "/images/Perfume/32.webp",
    name: "Divine Blush",
    description:
      "A floral-musky signature with jasmine, rose, and pink pepper sparkle.",
    notes: ["Jasmine", "Rose", "Pink Pepper"],
    price: "145.00",
    tag: "LUXURY",
    categorySlug: "women",
    collectionSlugs: ["women", "luxury"],
    stock: 18,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    modelNo: "SCT-012-A",
    parentModelNo: "SCT-012",
    slug: "inferno-spice-clove",
    image: "/images/Perfume/33.jpg",
    name: "Inferno Spice - Clove",
    description: "Spicier clove-forward take on Inferno Spice with saffron warmth.",
    notes: ["Clove", "Saffron", "Elemi"],
    price: "129.00",
    tag: "HOT",
    categorySlug: "men",
    collectionSlugs: ["men", "luxury"],
    stock: 14,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    modelNo: "SCT-013-A",
    parentModelNo: "SCT-013",
    slug: "marine-adventure-citrus",
    image: "/images/Perfume/34.webp",
    name: "Marine Adventure - Citrus",
    description: "Brighter citrus-led variant with crisp marine freshness.",
    notes: ["Citrus", "Benzoin", "Moss"],
    price: "105.00",
    tag: "NEW",
    categorySlug: "unisex",
    collectionSlugs: ["unisex", "all"],
    stock: 16,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    modelNo: "SCT-014-A",
    parentModelNo: "SCT-014",
    slug: "twin-paradise-tuberose",
    image: "/images/Perfume/18.webp",
    name: "Twin Paradise - Tuberose",
    description: "A creamy floral profile with extra tuberose and sandalwood depth.",
    notes: ["Tuberose", "Jasmine", "Sandalwood"],
    price: "149.00",
    tag: "POPULAR",
    categorySlug: "women",
    collectionSlugs: ["women", "luxury"],
    stock: 12,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    modelNo: "SCT-015-A",
    parentModelNo: "SCT-015",
    slug: "french-vanilla-tobacco",
    image: "/images/Perfume/30.webp",
    name: "French Vanilla Reserve - Tobacco",
    description: "Warmer vanilla profile with dry woods and soft tobacco nuance.",
    notes: ["Vanilla", "Tobacco", "Dry Woods"],
    price: "119.00",
    tag: "POPULAR",
    categorySlug: "unisex",
    collectionSlugs: ["unisex", "luxury"],
    stock: 15,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    modelNo: "SCT-016-A",
    parentModelNo: "SCT-016",
    slug: "magnolia-silk-jasmine",
    image: "/images/Perfume/35.webp",
    name: "Magnolia Silk - Jasmine",
    description: "Romantic jasmine-centric variant with velvety floral softness.",
    notes: ["Jasmine", "Lily of the Valley", "Musk"],
    price: "125.00",
    tag: "NEW",
    categorySlug: "women",
    collectionSlugs: ["women", "all"],
    stock: 13,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    modelNo: "SCT-017-A",
    parentModelNo: "SCT-017",
    slug: "nicolai-leather-woods",
    image: "/images/Perfume/37.webp",
    name: "Nicolai Leather - Woods",
    description: "Wood-heavy leather expression with musky trail and soft fruit facets.",
    notes: ["Leather", "Woods", "Musk"],
    price: "159.00",
    tag: "LUXURY",
    categorySlug: "unisex",
    collectionSlugs: ["unisex", "luxury"],
    stock: 10,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    modelNo: "SCT-018-A",
    parentModelNo: "SCT-018",
    slug: "torando-chypre-oakmoss",
    image: "/images/Perfume/31.webp",
    name: "Torando Chypre - Oakmoss",
    description: "Deeper chypre variant with strong oakmoss and patchouli character.",
    notes: ["Oakmoss", "Patchouli", "Cedar"],
    price: "139.00",
    tag: "HOT",
    categorySlug: "unisex",
    collectionSlugs: ["unisex", "all"],
    stock: 12,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    modelNo: "SCT-019-A",
    parentModelNo: "SCT-019",
    slug: "aura-amber-orris",
    image: "/images/Perfume/20.webp",
    name: "Aura Amber - Orris",
    description: "Powdery orris-focused take on Aura Amber with elegant woody dry-down.",
    notes: ["Orris", "Amber", "Sandalwood"],
    price: "128.00",
    tag: "POPULAR",
    categorySlug: "men",
    collectionSlugs: ["men", "all"],
    stock: 15,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    modelNo: "SCT-020-A",
    parentModelNo: "SCT-020",
    slug: "divine-blush-rose",
    image: "/images/Perfume/32.webp",
    name: "Divine Blush - Rose",
    description: "Rose-forward variant with delicate jasmine and soft musky finish.",
    notes: ["Rose", "Jasmine", "Musk"],
    price: "145.00",
    tag: "LUXURY",
    categorySlug: "women",
    collectionSlugs: ["women", "luxury"],
    stock: 11,
    isBestSeller: false,
    isFeatured: false,
  },
] satisfies Array<{
  slug: string;
  modelNo: string;
  image: string;
  name: string;
  description: string;
  notes: string[];
  price: string;
  tag: ProductTag;
  categorySlug: string;
  collectionSlugs: string[];
  parentModelNo?: string;
  stock: number;
  isBestSeller: boolean;
  isFeatured: boolean;
}>;

async function main() {
  loadEnv();
  const { db, sqlClient } = await import("@/lib/db");
  const categoryBySlug = new Map<string, string>();
  const collectionBySlug = new Map<string, string>();
  const productIdByModelNo = new Map<string, string>();

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
          modelNo: product.modelNo,
          slug: product.slug,
          description: product.description,
          seoUrl: `/products/${product.slug}`,
          seoTitle: buildSeoTitle(product.name),
          seoDescription: buildSeoDescription(product.name, product.description, product.notes),
          seoKeywords: buildSeoKeywords(product),
          googleShoppingDescription: buildGoogleShoppingDescription(
            product.name,
            product.description,
            product.notes,
          ),
          image: product.image,
          price: product.price,
          tag: product.tag,
          notes: product.notes,
          stock: product.stock,
          isBestSeller: product.isBestSeller,
          isFeatured: product.isFeatured,
          isActive: true,
          parentProductId: product.parentModelNo
            ? productIdByModelNo.get(product.parentModelNo) ?? null
            : null,
          categoryId,
        })
        .onConflictDoUpdate({
          target: products.slug,
          set: {
            name: product.name,
            modelNo: product.modelNo,
            description: product.description,
            seoUrl: `/products/${product.slug}`,
            seoTitle: buildSeoTitle(product.name),
            seoDescription: buildSeoDescription(
              product.name,
              product.description,
              product.notes,
            ),
            seoKeywords: buildSeoKeywords(product),
            googleShoppingDescription: buildGoogleShoppingDescription(
              product.name,
              product.description,
              product.notes,
            ),
            image: product.image,
            price: product.price,
            tag: product.tag,
            notes: product.notes,
            stock: product.stock,
            isBestSeller: product.isBestSeller,
            isFeatured: product.isFeatured,
            isActive: true,
            parentProductId: product.parentModelNo
              ? productIdByModelNo.get(product.parentModelNo) ?? null
              : null,
            categoryId,
            updatedAt: new Date(),
          },
        })
        .returning({ id: products.id });
      productIdByModelNo.set(product.modelNo, row.id);

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

function buildSeoTitle(name: string) {
  return `${name} Perfume | Scentora`;
}

function buildSeoDescription(name: string, description: string, notes: string[]) {
  return `${description} Notes include ${notes.join(", ")}. Shop ${name} perfume online from Scentora with premium fragrance presentation.`;
}

function buildSeoKeywords(product: (typeof productSeeds)[number]) {
  return [
    product.name,
    product.modelNo,
    "Scentora",
    "perfume",
    "fragrance",
    `${product.categorySlug} perfume`,
    ...product.notes,
  ];
}

function buildGoogleShoppingDescription(
  name: string,
  description: string,
  notes: string[],
) {
  return `${name} by Scentora. ${description} Fragrance notes: ${notes.join(", ")}. Premium perfume for daily wear, gifting, and special occasions.`;
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
