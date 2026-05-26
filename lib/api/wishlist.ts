import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { wishlistItems } from "@/lib/db/schema";
import { requireCustomerUser } from "@/lib/user-auth";

export async function getWishlistProductIdSet() {
  const user = await requireCustomerUser();

  if (!user) {
    return new Set<string>();
  }

  const rows = await db
    .select({ productId: wishlistItems.productId })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, user.id));

  return new Set(rows.map((row) => row.productId));
}
