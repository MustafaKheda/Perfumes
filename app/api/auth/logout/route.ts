import { NextResponse } from "next/server";
import { clearUserSessionCookie, revokeCurrentUserSession } from "@/lib/user-auth";

export async function POST() {
  await revokeCurrentUserSession();

  const response = NextResponse.json({
    message: "Signed out successfully",
  });

  clearUserSessionCookie(response);

  return response;
}
