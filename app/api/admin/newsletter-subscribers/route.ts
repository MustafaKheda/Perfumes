import { desc } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";

export async function GET() {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const subscribers = await db.query.newsletterSubscribers.findMany({
    orderBy: [desc(newsletterSubscribers.createdAt)],
    limit: 500,
  });

  return Response.json({
    data: subscribers.map((subscriber) => ({
      id: subscriber.id,
      email: subscriber.email,
      createdAt: subscriber.createdAt.toISOString(),
    })),
  });
}
