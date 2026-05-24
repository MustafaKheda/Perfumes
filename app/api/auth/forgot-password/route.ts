import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { badRequest } from "@/lib/api/http";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendPasswordResetEmail } from "@/lib/email";
import { createOtp } from "@/lib/otp";

type ForgotPasswordBody = {
  email?: unknown;
};

export async function POST(request: Request) {
  let body: ForgotPasswordBody;

  try {
    body = (await request.json()) as ForgotPasswordBody;
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
    },
  });

  if (!user || user.role !== "USER") {
    return NextResponse.json({
      message: "If that account exists, a reset code was sent",
    });
  }

  const otp = createOtp();
  await db
    .update(users)
    .set({
      passwordResetOtpHash: otp.hash,
      passwordResetOtpExpiresAt: otp.expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  const emailResult = await sendPasswordResetEmail({
    to: user.email,
    name: user.name ?? "there",
    code: otp.code,
  });

  return NextResponse.json({
    message: "If that account exists, a reset code was sent",
    data: {
      devOtp: emailResult.sent ? undefined : otp.code,
    },
  });
}
