import { NextResponse } from "next/server";
import { clearAdminSessionCookie } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ message: "Admin logged out" });
  clearAdminSessionCookie(response);

  return response;
}
