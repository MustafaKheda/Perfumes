CREATE TABLE IF NOT EXISTS "coupons" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "code" text NOT NULL,
  "description" text,
  "discount_type" text DEFAULT 'PERCENT' NOT NULL,
  "discount_value" numeric(10, 2) NOT NULL,
  "max_discount_amount" numeric(10, 2),
  "min_order_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
  "starts_at" timestamp with time zone,
  "expires_at" timestamp with time zone,
  "max_redemptions" integer,
  "redemption_count" integer DEFAULT 0 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "coupons_code_unique" ON "coupons" USING btree ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "coupons_is_active_idx" ON "coupons" USING btree ("is_active");--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_coupons" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "coupon_id" uuid NOT NULL REFERENCES "coupons"("id") ON DELETE cascade,
  "is_active" boolean DEFAULT true NOT NULL,
  "used_at" timestamp with time zone,
  "used_order_id" uuid REFERENCES "orders"("id") ON DELETE set null,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_coupons_user_coupon_unique" ON "user_coupons" USING btree ("user_id","coupon_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_coupons_user_id_idx" ON "user_coupons" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_coupons_coupon_id_idx" ON "user_coupons" USING btree ("coupon_id");
