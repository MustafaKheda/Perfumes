import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userSessions } from "@/lib/db/schema";

export const USER_SESSION_COOKIE = "scentora_user_session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type CustomerUser = {
  id: string;
  email: string;
  name: string | null;
  role: "USER";
};

export type CustomerSession = {
  id: string;
  user: CustomerUser;
  expiresAt: Date;
};

export async function createUserSessionToken(user: CustomerUser) {
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);

  await db.insert(userSessions).values({
    userId: user.id,
    tokenHash: hashSessionToken(token),
    expiresAt,
    lastSeenAt: now,
  });

  return token;
}

export async function getUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await db.query.userSessions.findFirst({
    where: and(
      eq(userSessions.tokenHash, hashSessionToken(token)),
      isNull(userSessions.revokedAt),
      gt(userSessions.expiresAt, new Date()),
    ),
    with: {
      user: {
        columns: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      },
    },
  });

  if (!session || session.user.role !== "USER") {
    return null;
  }

  await db
    .update(userSessions)
    .set({
      lastSeenAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userSessions.id, session.id));

  return {
    id: session.id,
    expiresAt: session.expiresAt,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: "USER" as const,
    },
  } satisfies CustomerSession;
}

export async function requireCustomerUser(): Promise<CustomerUser | null> {
  const session = await getUserSession();

  if (!session) {
    return null;
  }

  return session.user;
}

export function setUserSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearUserSessionCookie(response: NextResponse) {
  response.cookies.set(USER_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: 0,
  });
}

export async function revokeCurrentUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;

  if (!token) {
    return;
  }

  await db
    .update(userSessions)
    .set({
      revokedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userSessions.tokenHash, hashSessionToken(token)),
        isNull(userSessions.revokedAt),
      ),
    );
}

function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function shouldUseSecureCookies() {
  return process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") ?? false;
}
