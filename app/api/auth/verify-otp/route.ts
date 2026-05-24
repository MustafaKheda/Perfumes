import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { badRequest } from "@/lib/api/http";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashOtp, isOtpExpired } from "@/lib/otp";
import { createUserSessionToken, setUserSessionCookie } from "@/lib/user-auth";

type VerifyOtpBody = {
  email?: unknown;
  code?: unknown;
};

export async function POST(request: Request) {
  let body: VerifyOtpBody;

  try {
    body = (await request.json()) as VerifyOtpBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";

  if (!email || !code) {
    return badRequest("Email and verification code are required");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerifiedAt: true,
      verificationOtpHash: true,
      verificationOtpExpiresAt: true,
    },
  });

  if (!user || user.role !== "USER") {
    return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json({ message: "Account already verified" });
  }

  if (
    !user.verificationOtpHash ||
    user.verificationOtpHash !== hashOtp(code) ||
    isOtpExpired(user.verificationOtpExpiresAt)
  ) {
    return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 401 });
  }

  const now = new Date();
  await db
    .update(users)
    .set({
      emailVerifiedAt: now,
      verificationOtpHash: null,
      verificationOtpExpiresAt: null,
      lastLoginAt: now,
      updatedAt: now,
    })
    .where(eq(users.id, user.id));

  const customer = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: "USER" as const,
  };
  const response = NextResponse.json({
    message: "Account verified successfully",
    data: customer,
  });

  setUserSessionCookie(response, await createUserSessionToken(customer));

  return response;
}
