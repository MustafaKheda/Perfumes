import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/admin-auth";
import { badRequest } from "@/lib/api/http";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashOtp, isOtpExpired } from "@/lib/otp";

type ResetPasswordBody = {
  email?: unknown;
  code?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let body: ResetPasswordBody;

  try {
    body = (await request.json()) as ResetPasswordBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !code || !password) {
    return badRequest("Email, verification code, and new password are required");
  }

  if (password.length < 8) {
    return badRequest("Password must be at least 8 characters");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      role: true,
      passwordResetOtpHash: true,
      passwordResetOtpExpiresAt: true,
    },
  });

  if (
    !user ||
    user.role !== "USER" ||
    !user.passwordResetOtpHash ||
    user.passwordResetOtpHash !== hashOtp(code) ||
    isOtpExpired(user.passwordResetOtpExpiresAt)
  ) {
    return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 401 });
  }

  await db
    .update(users)
    .set({
      passwordHash: hashPassword(password),
      passwordResetOtpHash: null,
      passwordResetOtpExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return NextResponse.json({
    message: "Password reset successfully",
  });
}
