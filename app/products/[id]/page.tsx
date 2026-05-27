import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductDetailPurchase from "@/components/ProductDetailPurchase";
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
  const productDetailHtml =
    product.productDetailHtml ?? buildDefaultProductDetailHtml(product);
  const scentOptions =
    product.scentOptions.length > 0 ? product.scentOptions : product.notes.slice(0, 6);
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
                {product.description}{" "}
                <a
                  href="#detailed-description"
                  className="font-semibold text-textPrimary underline underline-offset-4"
                >
                  Click here
                </a>{" "}
                for detailed description and scent profile.
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

            <ProductDetailPurchase
              productId={product.id}
              name={product.name}
              image={product.image}
              price={product.price}
              notes={product.notes.join(", ")}
              tag={product.tag}
              slug={product.slug}
              isWishlisted={wishlistProductIds.has(product.id)}
              scentOptions={scentOptions}
            />

          </div>
        </div>

        <section
          id="detailed-description"
          className="mt-12 rounded-lg border border-black/10 bg-white p-6 shadow-sm md:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">
            Detailed Description
          </p>
          <h2 className="mt-2 font-heading text-3xl font-semibold">
            {product.name} fragrance story
          </h2>
          <div
            className="mt-5 space-y-4 text-sm leading-7 text-textSecondary md:text-base [&_b]:text-textPrimary [&_li]:pl-1 [&_p]:max-w-4xl [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5 md:[&_ul]:grid-cols-2"
            dangerouslySetInnerHTML={{ __html: productDetailHtml }}
          />
        </section>

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

function buildDefaultProductDetailHtml(product: NonNullable<Awaited<ReturnType<typeof findProductByIdOrSlug>>>) {
  const notes = product.notes.length > 0 ? product.notes : ["Amber", "Vanilla", "Sandalwood"];
  const [first, second, third] = notes;

  return `
    <p>${product.name} is designed as a polished signature perfume with a refined opening, smooth heart, and comfortable long-lasting base. The fragrance balances ${first ?? "warmth"} with ${second ?? "softness"} so it feels premium without becoming overwhelming. It is suitable for daily wear, evening plans, gifting, and customers who want a scent that feels confident, clean, and memorable.</p>
    <p><b>Features</b></p>
    <ul>
      <li>Professional fragrance profile with ${notes.join(", ")}.</li>
      <li>Balanced scent trail for personal wear and special occasions.</li>
      <li>Premium presentation suitable for gifting.</li>
      <li>Comfortable blend that works across seasons.</li>
      <li>Authentic Scentora catalog product with store-managed details.</li>
      <li>Recommended smell option: ${third ?? first ?? "Signature blend"}.</li>
    </ul>
  `;
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
