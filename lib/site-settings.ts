import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

export const PROMO_BANNER_TEXT_KEY = "promo_banner_text";
export const DEFAULT_PROMO_BANNER_TEXT =
  "Free Shipping on Orders over 30KWD - Arrives Next Day From 5 to 9 PM";

export async function getSiteSettings() {
  const promoBannerText = await ensureSiteSetting(
    PROMO_BANNER_TEXT_KEY,
    DEFAULT_PROMO_BANNER_TEXT,
  );

  return {
    promoBannerText,
  };
}

export async function getSiteSetting(key: string, fallback = "") {
  const row = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.key, key),
  });

  return row?.value ?? fallback;
}

async function ensureSiteSetting(key: string, fallback: string) {
  const value = await getSiteSetting(key);

  if (value) {
    return value;
  }

  await setSiteSetting(key, fallback);

  return fallback;
}

export async function setSiteSetting(key: string, value: string) {
  const now = new Date();

  await db
    .insert(siteSettings)
    .values({
      key,
      value,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: {
        value,
        updatedAt: now,
      },
    });
}
