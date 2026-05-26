import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailActions from "@/components/ProductDetailActions";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import Newsletter from "@/components/common/Newsletter";
import { findProductByIdOrSlug } from "@/lib/api/catalog";
import { getWishlistProductIdSet } from "@/lib/api/wishlist";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await findProductByIdOrSlug(id);

  if (!product) {
    return {
      title: "Product Not Found | Scentora",
    };
  }

  const title = `${product.name} | Scentora Perfume`;
  const description = product.detailedDescription ?? product.description;
  const canonical = `/products/${product.slug}`;

  return {
    title,
    description,
    keywords: [
      product.name,
      "Scentora",
      "perfume",
      "fragrance",
      product.categoryDetails.name,
      ...product.notes,
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Scentora",
      type: "website",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 1200,
          alt: `${product.name} perfume bottle`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, wishlistProductIds] = await Promise.all([
    findProductByIdOrSlug(id),
    getWishlistProductIdSet(),
  ]);

  if (!product) {
    notFound();
  }

  const productUrl = `${siteUrl}/products/${product.slug}`;
  const description = product.detailedDescription ?? product.description;
  const availability =
    product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Scentora",
    },
    category: product.categoryDetails.name,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Notes",
        value: product.notes.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Collection",
        value:
          product.collectionDetails.map((collection) => collection.name).join(", ") ||
          "Scentora",
      },
    ],
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      availability,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${siteUrl}/shop/all`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <main className="min-h-screen text-textPrimary">
      <section className="mx-auto w-full max-w-[1300px] px-4 py-8 font-body lg:px-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop/all" },
            { label: product.name, href: `/products/${product.slug}` },
          ]}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/5 shadow-img">
            <Image
              src={product.image}
              alt={`${product.name} perfume bottle`}
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
              priority
            />
            {product.tag ? (
              <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                {product.tag}
              </span>
            ) : null}
          </div>

          <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-textSecondary">
              {product.categoryDetails.name}
            </p>
            <h1 className="mt-2 font-heading text-4xl font-semibold leading-tight md:text-6xl">
              {product.name}
            </h1>
            <p className="mt-4 text-3xl font-semibold text-accent">
              ${product.price.toFixed(2)}
            </p>

            <div className="mt-5">
              <p className="text-sm leading-7 text-textSecondary md:text-base">
                {product.detailedDescription ?? product.description}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <DetailItem label="Stock" value={product.stock > 0 ? `${product.stock} available` : "Out of stock"} />
              <DetailItem label="Category" value={product.categoryDetails.name} />
              <DetailItem label="Notes" value={product.notes.join(", ") || "Signature blend"} />
              <DetailItem
                label="Collections"
                value={
                  product.collectionDetails.map((collection) => collection.name).join(", ") ||
                  "Scentora"
                }
              />
            </div>

            <div className="mt-7">
              <ProductDetailActions
                productId={product.id}
                name={product.name}
                image={product.image}
                price={product.price}
                notes={product.notes.join(", ")}
                tag={product.tag}
                slug={product.slug}
                isWishlisted={wishlistProductIds.has(product.id)}
              />
            </div>

            <div className="mt-7 rounded-lg bg-[#f6f1ea] p-4 text-sm leading-6 text-textSecondary">
              <p className="font-semibold text-textPrimary">Why this fragrance</p>
              <p>
                Crafted for daily wear and special moments, with a balanced note
                profile designed for lasting impression.
              </p>
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <InfoCard title="Next day delivery" text="Orders arrive next day from 5 to 9 PM where available." />
          <InfoCard title="Authentic scent" text="Every product is stored and fulfilled from Scentora catalog data." />
          <InfoCard title="Gift ready" text="Premium fragrance presentation for personal use or gifting." />
        </section>

        <section className="pt-12">
          <Newsletter />
        </section>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/10 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-textSecondary">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-textPrimary">{value}</p>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-textSecondary">{text}</p>
    </article>
  );
}
