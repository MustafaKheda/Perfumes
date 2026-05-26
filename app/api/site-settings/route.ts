import { getSiteSettings } from "@/lib/site-settings";

export async function GET() {
  return Response.json({
    data: await getSiteSettings(),
  });
}
