ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "model_no" text;--> statement-breakpoint
WITH numbered_products AS (
  SELECT
    "id",
    row_number() OVER (ORDER BY "created_at", "id") AS row_number
  FROM "products"
  WHERE "model_no" IS NULL
)
UPDATE "products"
SET "model_no" = 'SCT-' || lpad(numbered_products.row_number::text, 4, '0')
FROM numbered_products
WHERE "products"."id" = numbered_products."id";--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "model_no" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "products_model_no_unique" ON "products" USING btree ("model_no");
