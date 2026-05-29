import { unauthorized } from "@/lib/api/http";
import { rateLimitOrResponse } from "@/lib/api/rate-limit";
import { requireAdminUser } from "@/lib/admin-auth";
import { requireCustomerUser } from "@/lib/user-auth";

export async function secureAdminApi(request: Request, opts?: { id?: string }) {
  const limited = rateLimitOrResponse(request, {
    id: opts?.id ?? "admin",
    limit: 120,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const admin = await requireAdminUser();
  if (!admin) return unauthorized("Admin login required");
  return null;
}

export async function secureUserApi(request: Request, opts?: { id?: string }) {
  const limited = rateLimitOrResponse(request, {
    id: opts?.id ?? "user",
    limit: 90,
    windowMs: 60_000,
  });
  if (limited) return limited;

  const user = await requireCustomerUser();
  if (!user) return unauthorized("Please sign in");
  return null;
}

