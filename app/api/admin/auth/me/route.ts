import { ok, unauthorized } from "@/lib/api/http";
import { requireAdminUser } from "@/lib/admin-auth";

export async function GET() {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  return ok({ data: admin });
}
