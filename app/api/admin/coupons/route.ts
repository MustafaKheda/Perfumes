import { and, desc, eq, sql } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { badRequest, ok, unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { coupons, userCoupons, users } from "@/lib/db/schema";

type CreateCouponBody = {
  userId?: unknown;
  code?: unknown;
  description?: unknown;
  discountType?: unknown;
  discountValue?: unknown;
  minOrderAmount?: unknown;
  maxDiscountAmount?: unknown;
  startsAt?: unknown;
  expiresAt?: unknown;
};

export async function GET() {
  const admin = await requireAdminUser();
  if (!admin) {
    return unauthorized("Admin login required");
  }

  const rows = await db
    .select({
      userCouponId: userCoupons.id,
      userId: users.id,
      userEmail: users.email,
      userName: users.name,
      couponId: coupons.id,
      code: coupons.code,
      description: coupons.description,
      discountType: coupons.discountType,
      discountValue: coupons.discountValue,
      minOrderAmount: coupons.minOrderAmount,
      maxDiscountAmount: coupons.maxDiscountAmount,
      startsAt: coupons.startsAt,
      expiresAt: coupons.expiresAt,
      assignmentActive: userCoupons.isActive,
      usedAt: userCoupons.usedAt,
      createdAt: userCoupons.createdAt,
    })
    .from(userCoupons)
    .innerJoin(users, eq(userCoupons.userId, users.id))
    .innerJoin(coupons, eq(userCoupons.couponId, coupons.id))
    .orderBy(desc(userCoupons.createdAt))
    .limit(300);

  return ok({
    data: rows.map((row) => ({
      userCouponId: row.userCouponId,
      user: {
        id: row.userId,
        email: row.userEmail,
        name: row.userName,
      },
      coupon: {
        id: row.couponId,
        code: row.code,
        description: row.description,
        discountType: row.discountType,
        discountValue: Number(row.discountValue),
        minOrderAmount: Number(row.minOrderAmount),
        maxDiscountAmount:
          row.maxDiscountAmount === null ? null : Number(row.maxDiscountAmount),
        startsAt: row.startsAt?.toISOString() ?? null,
        expiresAt: row.expiresAt?.toISOString() ?? null,
      },
      assignmentActive: row.assignmentActive,
      usedAt: row.usedAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdminUser();
  if (!admin) {
    return unauthorized("Admin login required");
  }

  let body: CreateCouponBody;
  try {
    body = (await request.json()) as CreateCouponBody;
  } catch {
    return badRequest("Invalid JSON body");
  }

  const userId = toNonEmptyString(body.userId);
  const code = toCode(body.code);
  const discountType = body.discountType === "FIXED" ? "FIXED" : "PERCENT";
  const description = toOptionalString(body.description);
  const discountValue = toNumber(body.discountValue);
  const minOrderAmount = toNumber(body.minOrderAmount) ?? 0;
  const maxDiscountAmount =
    discountType === "PERCENT" ? toNumber(body.maxDiscountAmount) : null;
  const startsAt = toDate(body.startsAt);
  const expiresAt = toDate(body.expiresAt);

  if (!userId || !code || discountValue === null || discountValue <= 0) {
    return badRequest("userId, code, and discountValue are required");
  }

  if (discountType === "PERCENT" && discountValue > 100) {
    return badRequest("Percent discount cannot exceed 100");
  }

  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.role, "USER")),
    columns: { id: true },
  });
  if (!user) {
    return badRequest("Invalid userId");
  }

  const [existingCoupon] = await db
    .select({ id: coupons.id })
    .from(coupons)
    .where(eq(coupons.code, code))
    .limit(1);

  const couponId =
    existingCoupon?.id ??
    (
      await db
        .insert(coupons)
        .values({
          code,
          description,
          discountType,
          discountValue: discountValue.toFixed(2),
          minOrderAmount: minOrderAmount.toFixed(2),
          maxDiscountAmount:
            maxDiscountAmount === null ? null : maxDiscountAmount.toFixed(2),
          startsAt,
          expiresAt,
          isActive: true,
        })
        .returning({ id: coupons.id })
    )[0].id;

  await db
    .insert(userCoupons)
    .values({
      userId,
      couponId,
      isActive: true,
    })
    .onConflictDoUpdate({
      target: [userCoupons.userId, userCoupons.couponId],
      set: { isActive: true, usedAt: null, usedOrderId: null, updatedAt: sql`now()` },
    });

  return ok({ message: "Coupon assigned to user" }, { status: 201 });
}

function toNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function toOptionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
function toCode(value: unknown) {
  if (typeof value !== "string") return null;
  const code = value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  return code || null;
}
function toNumber(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}
function toDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
