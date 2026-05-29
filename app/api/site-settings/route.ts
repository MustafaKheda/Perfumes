import { getSiteSettings } from "@/lib/site-settings";
import { secureAdminApi } from "@/lib/api/secure";

export async function GET(request: Request) {
  const secured = await secureAdminApi(request, { id: "site-settings" });
  if (secured) return secured;

  return Response.json({
    data: await getSiteSettings(),
  });
}
