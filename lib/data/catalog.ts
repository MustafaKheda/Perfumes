export type ProductTag = "HOT" | "NEW" | "POPULAR" | "LUXURY";

export type Product = {
  id: string;
  modelNo: string;
  slug: string;
  image: string;
  name: string;
  description: string;
  seoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  googleShoppingDescription?: string;
  notes: string[];
  price: number;
  tag?: ProductTag;
  category: "men" | "women" | "unisex";
  collections: string[];
  stock: number;
  isBestSeller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: Product["category"];
  description: string;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  countLabel: string;
  images: string[];
};

export const categories: Category[] = [
  {
    id: "cat_men",
    name: "Men's Fragrances",
    slug: "men",
    description: "Bold, refined fragrances crafted for daily confidence.",
  },
  {
    id: "cat_women",
    name: "Women's Fragrances",
    slug: "women",
    description: "Elegant florals, soft musks, and expressive signature scents.",
  },
  {
    id: "cat_unisex",
    name: "Unisex Scents",
    slug: "unisex",
    description: "Balanced fragrances made for every style and occasion.",
  },
];

export const collections: Collection[] = [
  {
    id: "col_all",
    name: "All Collection",
    slug: "all",
    description: "Explore every Scentora fragrance in one place.",
    countLabel: "All Products",
    images: [
      "/images/Perfume/34.webp",
      "/images/Perfume/26.webp",
      "/images/Perfume/18.webp",
      "/images/Perfume/30.webp",
    ],
  },
  {
    id: "col_men",
    name: "Men's Collection",
    slug: "men",
    description: "Rich, long-lasting fragrances with oud, amber, and woods.",
    countLabel: "120+ Products",
    images: [
      "/images/Perfume/34.webp",
      "/images/Perfume/26.webp",
      "/images/Perfume/33.jpg",
      "/images/Perfume/25.webp",
    ],
  },
  {
    id: "col_women",
    name: "Women's Collection",
    slug: "women",
    description: "Soft florals, vanilla warmth, and polished everyday scents.",
    countLabel: "140+ Products",
    images: [
      "/images/Perfume/18.webp",
      "/images/Perfume/30.webp",
      "/images/Perfume/35.webp",
      "/images/Perfume/21.webp",
    ],
  },
  {
    id: "col_unisex",
    name: "Unisex Collection",
    slug: "unisex",
    description: "Modern fragrances built around balance and versatility.",
    countLabel: "90+ Products",
    images: [
      "/images/Perfume/9.webp",
      "/images/Perfume/31.webp",
      "/images/Perfume/35.webp",
      "/images/Perfume/20.webp",
    ],
  },
  {
    id: "col_luxury",
    name: "Luxury Collection",
    slug: "luxury",
    description: "Premium scents with refined ingredients and lasting depth.",
    countLabel: "340+ Products",
    images: [
      "/images/Perfume/32.webp",
      "/images/Perfume/37.webp",
      "/images/Perfume/31.webp",
      "/images/Perfume/36.webp",
    ],
  },
];

export const products: Product[] = [
  {
    id: "prod_001",
    modelNo: "SCT-001",
    slug: "noir-mystique",
    image: "/images/Perfume/1.webp",
    name: "Noir Mystique",
    description: "A deep, polished scent built around oud, bergamot, and amber.",
    notes: ["Oud", "Bergamot", "Amber"],
    price: 120,
    tag: "HOT",
    category: "men",
    collections: ["men", "luxury"],
    stock: 25,
    isBestSeller: true,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-10-01T00:00:00.000Z",
  },
  {
    id: "prod_002",
    modelNo: "SCT-002",
    slug: "velvet-bloom",
    image: "/images/Perfume/2.webp",
    name: "Velvet Bloom",
    description: "A soft floral blend of rose, vanilla, and clean musk.",
    notes: ["Rose", "Vanilla", "Musk"],
    price: 135,
    tag: "HOT",
    category: "women",
    collections: ["women", "luxury"],
    stock: 32,
    isBestSeller: true,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-10-02T00:00:00.000Z",
  },
  {
    id: "prod_003",
    modelNo: "SCT-003",
    slug: "amber-dusk",
    image: "/images/Perfume/9.webp",
    name: "Amber Dusk",
    description: "Warm amber and cedarwood balanced with a bright jasmine heart.",
    notes: ["Amber", "Cedarwood", "Jasmine"],
    price: 110,
    tag: "NEW",
    category: "unisex",
    collections: ["unisex"],
    stock: 18,
    isBestSeller: false,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-10-03T00:00:00.000Z",
  },
  {
    id: "prod_004",
    modelNo: "SCT-004",
    slug: "cedar-amber",
    image: "/images/Perfume/31.webp",
    name: "Cedar Amber",
    description: "A structured men's fragrance with cedarwood and amber depth.",
    notes: ["Amber", "Cedarwood", "Jasmine"],
    price: 110,
    tag: "NEW",
    category: "men",
    collections: ["men"],
    stock: 21,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-10-04T00:00:00.000Z",
  },
  {
    id: "prod_005",
    modelNo: "SCT-005",
    slug: "saffron-mist",
    image: "/images/Perfume/35.webp",
    name: "Saffron Mist",
    description: "A smooth unisex scent with warm spice and soft woods.",
    notes: ["Saffron", "Amber", "Sandalwood"],
    price: 110,
    tag: "NEW",
    category: "unisex",
    collections: ["unisex", "luxury"],
    stock: 16,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-10-05T00:00:00.000Z",
  },
  {
    id: "prod_006",
    modelNo: "SCT-006",
    slug: "oud-ember",
    image: "/images/Perfume/18.webp",
    name: "Oud Ember",
    description: "Smoky oud with bergamot lift and amber warmth.",
    notes: ["Oud", "Bergamot", "Amber"],
    price: 120,
    tag: "HOT",
    category: "men",
    collections: ["men", "luxury"],
    stock: 28,
    isBestSeller: true,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-10-06T00:00:00.000Z",
  },
  {
    id: "prod_007",
    modelNo: "SCT-007",
    slug: "rose-velour",
    image: "/images/Perfume/30.webp",
    name: "Rose Velour",
    description: "Rose and vanilla over a gentle musk base.",
    notes: ["Rose", "Vanilla", "Musk"],
    price: 135,
    tag: "HOT",
    category: "women",
    collections: ["women"],
    stock: 30,
    isBestSeller: true,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-10-07T00:00:00.000Z",
  },
  {
    id: "prod_008",
    modelNo: "SCT-008",
    slug: "floral-noir",
    image: "/images/Perfume/7.webp",
    name: "Floral Noir",
    description: "A feminine floral scent with a deeper amber finish.",
    notes: ["Oud", "Bergamot", "Amber"],
    price: 120,
    tag: "HOT",
    category: "women",
    collections: ["women"],
    stock: 24,
    isBestSeller: false,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-10-08T00:00:00.000Z",
  },
  {
    id: "prod_009",
    modelNo: "SCT-009",
    slug: "golden-noir",
    image: "/images/Perfume/37.webp",
    name: "Golden Noir",
    description: "A bold women's scent with amber, bergamot, and oud.",
    notes: ["Oud", "Bergamot", "Amber"],
    price: 120,
    tag: "HOT",
    category: "women",
    collections: ["women", "luxury"],
    stock: 14,
    isBestSeller: false,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-10-09T00:00:00.000Z",
  },
  {
    id: "prod_010",
    modelNo: "SCT-010",
    slug: "musk-bloom",
    image: "/images/Perfume/32.webp",
    name: "Musk Bloom",
    description: "Rose, vanilla, and musk in a smooth premium profile.",
    notes: ["Rose", "Vanilla", "Musk"],
    price: 135,
    tag: "HOT",
    category: "women",
    collections: ["women", "luxury"],
    stock: 19,
    isBestSeller: true,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-10-10T00:00:00.000Z",
  },
  {
    id: "prod_011",
    modelNo: "SCT-011",
    slug: "midnight-amber",
    image: "/images/Perfume/20.webp",
    name: "Midnight Amber",
    description: "A warm evening fragrance with amber, vanilla, and sandalwood.",
    notes: ["Amber", "Vanilla", "Sandalwood"],
    price: 110,
    tag: "POPULAR",
    category: "men",
    collections: ["men"],
    stock: 25,
    isBestSeller: true,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-10-11T00:00:00.000Z",
  },
];
