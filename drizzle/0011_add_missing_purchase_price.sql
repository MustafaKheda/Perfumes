ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "purchase_price" numeric(10, 2) DEFAULT '0' NOT NULL;
