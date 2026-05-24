import { desc } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { contactInquiries } from "@/lib/db/schema";

export async function GET() {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const inquiries = await db.query.contactInquiries.findMany({
    orderBy: [desc(contactInquiries.createdAt)],
    limit: 100,
  });

  return Response.json({
    data: inquiries.map((inquiry) => ({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message,
      createdAt: inquiry.createdAt.toISOString(),
    })),
  });
}
