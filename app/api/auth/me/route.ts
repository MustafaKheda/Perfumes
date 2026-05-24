import { NextResponse } from "next/server";
import { requireCustomerUser } from "@/lib/user-auth";

export async function GET() {
  const user = await requireCustomerUser();

  if (!user) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
}
