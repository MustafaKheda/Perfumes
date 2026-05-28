ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "parent_product_id" uuid;--> statement-breakpoint
DO $$ BEGIN
  ALTER TABLE "products"
  ADD CONSTRAINT "products_parent_product_id_products_id_fk"
  FOREIGN KEY ("parent_product_id") REFERENCES "public"."products"("id")
  ON DELETE set null ON UPDATE no action;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_parent_product_id_idx" ON "products" USING btree ("parent_product_id");
