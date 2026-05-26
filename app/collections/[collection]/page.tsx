import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Heading } from "@/components/common/PageHeading";
import Newsletter from "@/components/common/Newsletter";
import BestSellersSection from "@/components/BestsellersSection";
import CollectionProducts from "@/components/CollectionProducts";
import { findCollectionBySlug, getProducts } from "@/lib/api/catalog";
import { getWishlistProductIdSet } from "@/lib/api/wishlist";

interface Props {
  params: Promise<{
    collection: string;
  }>;
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scentora Perfumes | Collections",
  description:
    "Explore Scentora's luxury perfume collections crafted for men, women, and unisex fragrances.",
};

export const labelMap: Record<string, string> = {
  all: "All Collection",
  men: "Men's Collection",
  women: "Women's Collection",
  unisex: "Unisex Collection",
  luxury: "Luxury Collection",
};

export default async function CollectionPage({ params }: Props) {
  const { collection } = await params;
  const collectionDetails = await findCollectionBySlug(collection);

  if (!collectionDetails) {
    notFound();
  }

  const [result, wishlistProductIds] = await Promise.all([
    getProducts({
      collection: collection === "all" ? null : collection,
      limit: "48",
    }),
    getWishlistProductIdSet(),
  ]);
  const collectionName = labelMap[collection] ?? collectionDetails.name;

  const breadcrumbItems = [
    { label: "Collection", href: "/" },
    { label: collectionName, href: `/collections/${collection}` },
  ];

  return (
    <main className="min-h-screen max-w-[1300px] mx-auto px-4 text-textPrimary font-body">
      <Breadcrumb items={breadcrumbItems} />
      <Heading
        text={collectionName}
        subtitle={
          collectionDetails.description ??
          "Indulge in our carefully curated collection of premium perfumes."
        }
      />
      <section className="flex flex-col gap-y-16 pb-10 w-full">
        <CollectionProducts
          products={result.data.map((product) => ({
            id: product.id,
            image: product.image,
            name: product.name,
            slug: product.slug,
            notes: product.notes.join(", "),
            price: product.price.toFixed(2),
            tag: product.tag ?? undefined,
            collection,
            description: product.description,
            isWishlisted: wishlistProductIds.has(product.id),
          }))}
        />
        <BestSellersSection />
        <Newsletter />
      </section>
    </main>
  );
}

export function generateStaticParams() {
  return [
    { collection: "all" },
    { collection: "men" },
    { collection: "women" },
    { collection: "unisex" },
    { collection: "luxury" },
  ];
}
