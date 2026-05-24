import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/lib/admin-auth";
import { badRequest } from "@/lib/api/http";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createUserSessionToken, setUserSessionCookie } from "@/lib/user-auth";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return badRequest("Email and password are required");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
      passwordHash: true,
      emailVerifiedAt: true,
    },
  });

  if (!user || user.role !== "USER" || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (!user.emailVerifiedAt) {
    return NextResponse.json(
      { error: "Please verify your email before signing in" },
      { status: 403 },
    );
  }

  const customer = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: "USER" as const,
  };

  await db
    .update(users)
    .set({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  const response = NextResponse.json({
    message: "Login successful",
    data: customer,
  });

  setUserSessionCookie(response, createUserSessionToken(customer));

  return response;
}
