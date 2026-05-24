import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import {
  createAdminSessionToken,
  setAdminSessionCookie,
  verifyAdminPasswordFallback,
  verifyPassword,
} from "@/lib/admin-auth";
import { badRequest } from "@/lib/api/http";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

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
    },
  });

  const passwordMatches = user?.passwordHash
    ? verifyPassword(password, user.passwordHash)
    : verifyAdminPasswordFallback(password);

  if (!user || user.role !== "ADMIN" || !passwordMatches) {
    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  }

  const adminUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: "ADMIN" as const,
  };
  const response = NextResponse.json({
    message: "Admin login successful",
    data: adminUser,
  });

  setAdminSessionCookie(response, createAdminSessionToken(adminUser));

  return response;
}
