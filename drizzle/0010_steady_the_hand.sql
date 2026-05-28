ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seo_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seo_title" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seo_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "seo_keywords" text[] DEFAULT ARRAY[]::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "google_shopping_description" text;--> statement-breakpoint
UPDATE "products"
SET
  "seo_url" = COALESCE("seo_url", '/products/' || "slug"),
  "seo_title" = COALESCE("seo_title", "name" || ' Perfume | Scentora'),
  "seo_description" = COALESCE(
    "seo_description",
    "description" || ' Shop ' || "name" || ' perfume online from Scentora with premium fragrance presentation.'
  ),
  "seo_keywords" = CASE
    WHEN cardinality("seo_keywords") = 0 THEN ARRAY[
      "name",
      "model_no",
      'Scentora',
      'perfume',
      'fragrance'
    ]::text[] || "notes"
    ELSE "seo_keywords"
  END,
  "google_shopping_description" = COALESCE(
    "google_shopping_description",
    "name" || ' by Scentora. ' || "description" || ' Premium perfume for daily wear, gifting, and special occasions.'
  );
