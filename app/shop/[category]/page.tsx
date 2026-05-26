import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCardLarge";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Heading } from "@/components/common/PageHeading";
import { FilterBar } from "@/components/Filterbar";
import Newsletter from "@/components/common/Newsletter";
import { Pagination } from "@/components/common/Pagination";
import BestSellersSection from "@/components/BestsellersSection";
import { findCategoryBySlug, getProducts } from "@/lib/api/catalog";
import { getWishlistProductIdSet } from "@/lib/api/wishlist";

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams?: Promise<{
    search?: string | string[];
  }>;
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scentora Perfumes | Collections",
  description:
    "Explore Scentora's luxury perfume collections crafted for men, women, and unisex fragrances.",
};

export const labelMap: Record<string, string> = {
  all: "All Perfume",
  men: "Men's Luxury Perfume",
  women: "Women's Luxury Perfume",
  unisex: "Unisex Luxury Perfume",
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const search =
    typeof resolvedSearchParams?.search === "string"
      ? resolvedSearchParams.search.trim()
      : "";
  const categoryDetails =
    category === "all" ? null : await findCategoryBySlug(category);

  if (category !== "all" && !categoryDetails) {
    notFound();
  }

  const [result, wishlistProductIds] = await Promise.all([
    getProducts({
      category: category === "all" ? null : category,
      search,
      limit: "48",
    }),
    getWishlistProductIdSet(),
  ]);
  const headingTitle = labelMap[category] ?? categoryDetails?.name ?? "Perfumes";
  const pageTitle = search
    ? `Search results for "${search}"`
    : `${headingTitle}s`;

  const breadcrumbItems = [
    { label: "Shop", href: "/" },
    { label: headingTitle, href: `/shop/${category}` },
  ];

  return (
    <main className="min-h-screen max-w-[1300px] mx-auto px-4 font-body">
      <Breadcrumb items={breadcrumbItems} />
      <Heading
        text={pageTitle}
        count={result.meta.total}
        Filter={<FilterBar currentCategory={category} />}
      />

      {result.data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-wrap mb-10">
          {result.data.map((product) => (
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
        <p className="text-center text-textSecondary py-10">
          {search
            ? `No perfumes found for "${search}".`
            : "No perfumes found in this category."}
        </p>
      )}

      {result.meta.totalPages > 1 ? <Pagination /> : null}
      <section className="flex flex-col gap-y-16 pt-10 pb-10 md:pt-16 w-full">
        <BestSellersSection />
        <Newsletter />
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return [
    { category: "all" },
    { category: "men" },
    { category: "women" },
    { category: "unisex" },
  ];
}
