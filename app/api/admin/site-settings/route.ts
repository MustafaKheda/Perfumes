import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, unauthorized } from "@/lib/api/http";
import {
  getSiteSettings,
  CONTACT_EMAIL_KEY,
  CONTACT_PHONE_KEY,
  FACEBOOK_URL_KEY,
  INSTAGRAM_URL_KEY,
  PROMO_BANNER_TEXT_KEY,
  setSiteSetting,
  X_URL_KEY,
  YOUTUBE_URL_KEY,
} from "@/lib/site-settings";

type SiteSettingsBody = {
  promoBannerText?: unknown;
  facebookUrl?: unknown;
  xUrl?: unknown;
  youtubeUrl?: unknown;
  instagramUrl?: unknown;
  contactPhone?: unknown;
  contactEmail?: unknown;
};

export async function GET() {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  return Response.json({
    data: await getSiteSettings(),
  });
}

export async function PATCH(request: Request) {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const body = await readBody(request);
  const promoBannerText =
    typeof body.promoBannerText === "string" ? body.promoBannerText.trim() : "";
  const facebookUrl = normalizeString(body.facebookUrl);
  const xUrl = normalizeString(body.xUrl);
  const youtubeUrl = normalizeString(body.youtubeUrl);
  const instagramUrl = normalizeString(body.instagramUrl);
  const contactPhone = normalizeString(body.contactPhone);
  const contactEmail = normalizeString(body.contactEmail);

  if (!promoBannerText) {
    return badRequest("Promotional line is required");
  }

  await setSiteSetting(PROMO_BANNER_TEXT_KEY, promoBannerText);
  await Promise.all([
    setSiteSetting(FACEBOOK_URL_KEY, facebookUrl),
    setSiteSetting(X_URL_KEY, xUrl),
    setSiteSetting(YOUTUBE_URL_KEY, youtubeUrl),
    setSiteSetting(INSTAGRAM_URL_KEY, instagramUrl),
    setSiteSetting(CONTACT_PHONE_KEY, contactPhone),
    setSiteSetting(CONTACT_EMAIL_KEY, contactEmail),
  ]);

  return Response.json({
    data: await getSiteSettings(),
    message: "Settings updated",
  });
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function readBody(request: Request): Promise<SiteSettingsBody> {
  try {
    return (await request.json()) as SiteSettingsBody;
  } catch {
    return {};
  }
}
