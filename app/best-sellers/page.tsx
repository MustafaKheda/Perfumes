import type { Metadata } from "next";
import ProductCard from "@/components/ProductCardLarge";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Heading } from "@/components/common/PageHeading";
import Newsletter from "@/components/common/Newsletter";
import { ensureMonthlyBestSellerEvaluation } from "@/lib/api/best-sellers";
import { getProducts } from "@/lib/api/catalog";
import { getWishlistProductIdSet } from "@/lib/api/wishlist";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Best Selling Perfumes | Scentora",
  description:
    "Shop Scentora best-selling and trending perfumes, automatically selected from monthly sales performance.",
};

export default async function BestSellersPage() {
  await ensureMonthlyBestSellerEvaluation();

  const [bestSellers, trending, wishlistProductIds] = await Promise.all([
    getProducts({ bestSeller: "true", limit: "12" }),
    getProducts({ featured: "true", limit: "12" }),
    getWishlistProductIdSet(),
  ]);

  return (
    <main className="min-h-screen max-w-[1300px] mx-auto px-4 font-body">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Best Sellers", href: "/best-sellers" },
        ]}
      />
      <Heading
        text="Best Selling Perfumes"
        subtitle="Automatically refreshed every month from sales performance, with admin control when manual curation is needed."
        className="max-w-4xl"
      />

      <ProductSection
        title="Best Sellers"
        products={bestSellers.data}
        wishlistProductIds={wishlistProductIds}
        emptyText="No best-selling products selected yet."
      />

      <ProductSection
        title="Trending Now"
        products={trending.data}
        wishlistProductIds={wishlistProductIds}
        emptyText="No trending products selected yet."
      />

      <section className="flex flex-col gap-y-16 pt-10 pb-10 md:pt-16 w-full">
        <Newsletter />
      </section>
    </main>
  );
}

type Product = Awaited<ReturnType<typeof getProducts>>["data"][number];

function ProductSection({
  title,
  products,
  wishlistProductIds,
  emptyText,
}: {
  title: string;
  products: Product[];
  wishlistProductIds: Set<string>;
  emptyText: string;
}) {
  return (
    <section className="mb-14">
      <h2 className="mb-5 font-heading text-3xl font-semibold">{title}</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-wrap">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              productId={product.id}
              image={product.image}
              name={product.name}
              slug={product.slug}
              notes={product.notes.join(", ")}
              price={product.price.toFixed(2)}
              tag={product.tag ?? undefined}
              category={product.category}
              isWishlisted={wishlistProductIds.has(product.id)}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-black/10 bg-white p-6 text-center text-textSecondary">
          {emptyText}
        </p>
      )}
    </section>
  );
}
