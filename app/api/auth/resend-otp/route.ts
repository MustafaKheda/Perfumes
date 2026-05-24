import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { badRequest } from "@/lib/api/http";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendVerificationEmail } from "@/lib/email";
import { createOtp } from "@/lib/otp";

type ResendOtpBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  let body: ResendOtpBody;

  try {
    body = (await request.json()) as ResendOtpBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return badRequest("Email is required");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerifiedAt: true,
    },
  });

  if (!user || user.role !== "USER") {
    return NextResponse.json({ message: "If the account exists, a code was sent" });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json({ message: "Account is already verified" });
  }

  const otp = createOtp();
  await db
    .update(users)
    .set({
      verificationOtpHash: otp.hash,
      verificationOtpExpiresAt: otp.expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  const emailResult = await sendVerificationEmail({
    to: user.email,
    name: user.name ?? "there",
    code: otp.code,
  });

  return NextResponse.json({
    message: "Verification code sent",
    data: {
      devOtp: emailResult.sent ? undefined : otp.code,
    },
  });
}
