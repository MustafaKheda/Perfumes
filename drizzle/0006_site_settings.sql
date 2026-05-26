CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "site_settings" ("key", "value")
VALUES (
	'promo_banner_text',
	'Free Shipping on Orders over 30KWD - Arrives Next Day From 5 to 9 PM'
)
ON CONFLICT ("key") DO NOTHING;
