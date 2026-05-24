import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/admin-auth";
import { badRequest } from "@/lib/api/http";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendVerificationEmail } from "@/lib/email";
import { createOtp } from "@/lib/otp";

type SignupBody = {
  name?: unknown;
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let body: SignupBody;

  try {
    body = (await request.json()) as SignupBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return badRequest("Name, email, and password are required");
  }

  if (password.length < 8) {
    return badRequest("Password must be at least 8 characters");
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true },
  });

  if (existingUser) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const otp = createOtp();
  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash: hashPassword(password),
      role: "USER",
      verificationOtpHash: otp.hash,
      verificationOtpExpiresAt: otp.expiresAt,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
    });

  const emailResult = await sendVerificationEmail({
    to: user.email,
    name: user.name ?? "there",
    code: otp.code,
  });

  return NextResponse.json({
    message: "Account created successfully",
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: "USER" as const,
      verificationRequired: true,
      devOtp: emailResult.sent ? undefined : otp.code,
    },
  });
}
