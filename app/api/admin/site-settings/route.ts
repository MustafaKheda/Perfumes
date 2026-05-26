import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, unauthorized } from "@/lib/api/http";
import {
  getSiteSettings,
  PROMO_BANNER_TEXT_KEY,
  setSiteSetting,
} from "@/lib/site-settings";

type SiteSettingsBody = {
  promoBannerText?: unknown;
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

  if (!promoBannerText) {
    return badRequest("Promotional line is required");
  }

  await setSiteSetting(PROMO_BANNER_TEXT_KEY, promoBannerText);

  return Response.json({
    data: await getSiteSettings(),
    message: "Settings updated",
  });
}

async function readBody(request: Request): Promise<SiteSettingsBody> {
  try {
    return (await request.json()) as SiteSettingsBody;
  } catch {
    return {};
  }
}
