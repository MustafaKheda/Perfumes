import { badRequest, ok } from "@/lib/api/http";
import { secureUserApi } from "@/lib/api/secure";
import { db } from "@/lib/db";
import { contactInquiries } from "@/lib/db/schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  const secured = await secureUserApi(request, { id: "contact" });
  if (secured) return secured;

  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const name = readString(body.name);
  const email = readString(body.email).toLowerCase();
  const phone = readString(body.phone);
  const subject = readString(body.subject);
  const message = readString(body.message);

  if (!name || !email || !subject || !message) {
    return badRequest("Name, email, subject, and message are required");
  }

  if (!emailPattern.test(email)) {
    return badRequest("A valid email is required");
  }

  const [inquiry] = await db
    .insert(contactInquiries)
    .values({
      name,
      email,
      phone: phone || null,
      subject,
      message,
    })
    .returning();

  return ok(
    {
      message: "Contact message received",
      data: {
        id: inquiry.id,
        createdAt: inquiry.createdAt.toISOString(),
      },
    },
    { status: 201 },
  );
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
