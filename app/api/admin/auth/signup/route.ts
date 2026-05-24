import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import {
  createAdminSessionToken,
  setAdminSessionCookie,
  hashPassword,
} from "@/lib/admin-auth";
import { badRequest } from "@/lib/api/http";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

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

  // Check if email already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 },
    );
  }

  try {
    // Create new admin user
    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash: hashPassword(password),
        role: "ADMIN",
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      });

    const adminUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: "ADMIN" as const,
    };

    const token = createAdminSessionToken(adminUser);
    const response = NextResponse.json({
      message: "Admin account created successfully",
      data: adminUser,
    });

    setAdminSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}
