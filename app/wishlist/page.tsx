import ProductCard from "@/components/ProductCardLarge";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Heading } from "@/components/common/PageHeading";
import Newsletter from "@/components/common/Newsletter";
import GuestWishlistView from "./ui/guest-wishlist-view";
import { requireCustomerUser } from "@/lib/user-auth";
import { db } from "@/lib/db";
import { products, wishlistItems } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wishlist | Scentora",
  description: "View your saved Scentora perfumes.",
};

export default async function WishlistPage() {
  const user = await requireCustomerUser();

  const items = user
    ? await db
        .select({
          product: products,
        })
        .from(wishlistItems)
        .innerJoin(products, eq(wishlistItems.productId, products.id))
        .where(and(eq(wishlistItems.userId, user.id), eq(products.isActive, true)))
        .orderBy(desc(wishlistItems.createdAt))
    : [];

  return (
    <main className="min-h-screen max-w-[1300px] mx-auto px-4 font-body">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wishlist", href: "/wishlist" },
        ]}
      />
      {!user ? (
        <GuestWishlistView />
      ) : (
        <>
          <Heading text="Wishlist" count={items.length} />

          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-wrap mb-10">
              {items.map(({ product }) => (
                <ProductCard
                  key={product.id}
                  productId={product.id}
                  image={product.image}
                  name={product.name}
                  slug={product.slug}
                  notes={product.notes.join(", ")}
                  price={Number(product.price).toFixed(2)}
                  tag={product.tag ?? undefined}
                  isWishlisted
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-textSecondary py-10">
              Your wishlist is empty.
            </p>
          )}
        </>
      )}

      <section className="flex flex-col gap-y-16 pt-10 pb-10 md:pt-16 w-full">
        <Newsletter />
      </section>
    </main>
  );
}
