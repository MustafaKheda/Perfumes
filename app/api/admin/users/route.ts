import { count, desc, sql } from "drizzle-orm";
import { requireAdminUser } from "@/lib/admin-auth";
import { unauthorized } from "@/lib/api/http";
import { db } from "@/lib/db";
import { cartItems, orders, userSessions, users } from "@/lib/db/schema";

export async function GET() {
  const admin = await requireAdminUser();

  if (!admin) {
    return unauthorized("Admin login required");
  }

  const [userRows, orderRows, cartRows, sessionRows] = await Promise.all([
    db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [desc(users.createdAt)],
      limit: 500,
    }),
    db
      .select({
        userId: orders.userId,
        orderCount: count(orders.id),
        totalSpent: sql<string>`coalesce(sum(${orders.totalAmount}), 0)`,
        lastOrderAt: sql<Date | null>`max(${orders.createdAt})`,
      })
      .from(orders)
      .groupBy(orders.userId),
    db
      .select({
        userId: cartItems.userId,
        cartItemCount: count(cartItems.id),
        cartQuantity: sql<number>`coalesce(sum(${cartItems.quantity}), 0)`,
        lastCartUpdatedAt: sql<Date | null>`max(${cartItems.updatedAt})`,
      })
      .from(cartItems)
      .groupBy(cartItems.userId),
    db
      .select({
        userId: userSessions.userId,
        activeSessionCount: count(userSessions.id),
        lastSeenAt: sql<Date | null>`max(${userSessions.lastSeenAt})`,
      })
      .from(userSessions)
      .where(sql`${userSessions.revokedAt} is null and ${userSessions.expiresAt} > now()`)
      .groupBy(userSessions.userId),
  ]);

  const orderStats = new Map(
    orderRows
      .filter((row) => row.userId)
      .map((row) => [
        row.userId!,
        {
          orderCount: row.orderCount,
          totalSpent: Number(row.totalSpent),
          lastOrderAt: row.lastOrderAt,
        },
      ]),
  );
  const cartStats = new Map(
    cartRows.map((row) => [
      row.userId,
      {
        cartItemCount: row.cartItemCount,
        cartQuantity: Number(row.cartQuantity),
        lastCartUpdatedAt: row.lastCartUpdatedAt,
      },
    ]),
  );
  const sessionStats = new Map(
    sessionRows.map((row) => [
      row.userId,
      {
        activeSessionCount: row.activeSessionCount,
        lastSeenAt: row.lastSeenAt,
      },
    ]),
  );

  return Response.json({
    data: userRows.map((user) => {
      const userOrderStats = orderStats.get(user.id);
      const userCartStats = cartStats.get(user.id);
      const userSessionStats = sessionStats.get(user.id);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
        lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        orderCount: userOrderStats?.orderCount ?? 0,
        totalSpent: userOrderStats?.totalSpent ?? 0,
        lastOrderAt: toIsoString(userOrderStats?.lastOrderAt),
        cartItemCount: userCartStats?.cartItemCount ?? 0,
        cartQuantity: userCartStats?.cartQuantity ?? 0,
        lastCartUpdatedAt: toIsoString(userCartStats?.lastCartUpdatedAt),
        activeSessionCount: userSessionStats?.activeSessionCount ?? 0,
        lastSeenAt: toIsoString(userSessionStats?.lastSeenAt),
      };
    }),
  });
}

function toIsoString(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}
