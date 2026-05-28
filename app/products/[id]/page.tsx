import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock3, Gift, PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";
import ProductDetailPurchase from "@/components/ProductDetailPurchase";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import Newsletter from "@/components/common/Newsletter";
import { findProductByIdOrSlug, getProductVariants } from "@/lib/api/catalog";
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

  const title = product.seoTitle ?? `${product.name} Perfume | Scentora`;
  const description =
    product.seoDescription ?? product.detailedDescription ?? product.description;
  const canonical = product.seoUrl ?? `/products/${product.slug}`;
  const keywords =
    product.seoKeywords.length > 0
      ? product.seoKeywords
      : [
          product.name,
          product.modelNo,
          "Scentora",
          "perfume",
          "fragrance",
          product.categoryDetails.name,
          ...product.notes,
        ];

  return {
    title,
    description,
    keywords,
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

  const productPath = product.seoUrl ?? `/products/${product.slug}`;
  const productUrl = productPath.startsWith("http")
    ? productPath
    : `${siteUrl}${productPath}`;
  const shoppingDescription =
    product.googleShoppingDescription ??
    product.seoDescription ??
    product.detailedDescription ??
    product.description;
  const productDetailHtml =
    product.productDetailHtml ?? buildDefaultProductDetailHtml(product);
  const variants = await getProductVariants(product.id);
  const scentOptions =
    variants.length > 0
      ? variants.map((variant: { name: string }) => variant.name)
      : product.scentOptions.length > 0
        ? product.scentOptions
        : product.notes.slice(0, 6);
  const collectionLabel =
    product.collectionDetails
      .map((collection: { name: string }) => collection.name)
      .join(", ") ||
    "Scentora";
  const heroNotes =
    product.notes.length > 0 ? product.notes.slice(0, 4) : ["Amber", "Vanilla", "Sandalwood"];
  const availability =
    product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: shoppingDescription,
    sku: product.modelNo,
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
        name: "Google Shopping Description",
        value: shoppingDescription,
      },
      {
        "@type": "PropertyValue",
        name: "Collection",
        value:
          product.collectionDetails
            .map((collection: { name: string }) => collection.name)
            .join(", ") ||
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
    <main className="min-h-screen overflow-hidden bg-[#fffaf0] text-textPrimary">
      <section className="mx-auto w-full max-w-[1360px] px-4 py-6 font-body lg:px-6 lg:py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop/all" },
            { label: product.name, href: `/products/${product.slug}` },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:items-start">
          <section className="relative min-h-[520px] overflow-hidden rounded-2xl bg-[#16110d] text-white shadow-img lg:sticky lg:top-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(252,140,61,0.34),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.09),transparent_34%),linear-gradient(160deg,#24170f,#0f0d0b_68%)]" />
            <div className="absolute bottom-0 left-0 h-36 w-full bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative grid min-h-[520px] content-between p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] backdrop-blur">
                    {product.categoryDetails.name}
                  </span>
                  {product.tag ? (
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white">
                      {product.tag}
                    </span>
                  ) : null}
                </div>
                <span className="font-mono text-xs font-semibold text-white/70">
                  {product.modelNo}
                </span>
              </div>

              <div className="relative mx-auto my-8 aspect-[4/5] w-[min(78vw,430px)] overflow-hidden rounded-2xl bg-white/8 shadow-[0_35px_80px_rgba(0,0,0,0.42)] ring-1 ring-white/14 sm:w-[min(58vw,460px)]">
                <Image
                  src={product.image}
                  alt={`${product.name} perfume bottle`}
                  fill
                  sizes="(max-width: 1024px) 86vw, 46vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    Signature profile
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {heroNotes.map((note: string) => (
                      <span
                        key={note}
                        className="rounded-full border border-white/20 bg-black/24 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-white/82">
                <VisualStat value="5-9 PM" label="Delivery slot" />
                <VisualStat value={product.stock > 0 ? `${product.stock}` : "0"} label="In stock" />
                <VisualStat value={scentOptions.length.toString()} label="Smell options" />
              </div>
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-textSecondary">
                Premium fragrance
              </p>
              <h1 className="mt-2 font-heading text-4xl font-semibold leading-tight md:text-6xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-textSecondary md:text-base">
                {product.description}
              </p>

              <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-y border-black/10 py-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-textSecondary">
                    Price
                  </p>
                  <p className="mt-1 text-4xl font-semibold text-accent">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg bg-[#f6f0df] px-4 py-3 text-sm font-semibold text-textPrimary">
                  {product.stock > 0 ? `${product.stock} pieces available` : "Out of stock"}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <DetailItem label="Model no" value={product.modelNo} />
                <DetailItem label="Category" value={product.categoryDetails.name} />
                <DetailItem label="Notes" value={product.notes.join(", ") || "Signature blend"} />
                <DetailItem label="Collections" value={collectionLabel} />
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
            </section>

            <section className="grid gap-3 sm:grid-cols-3">
              <TrustTile icon={<Truck className="h-4 w-4" />} title="Next day" text="Fast local delivery window." />
              <TrustTile icon={<ShieldCheck className="h-4 w-4" />} title="Authentic" text="Catalog managed product." />
              <TrustTile icon={<Gift className="h-4 w-4" />} title="Gift ready" text="Premium presentation." />
            </section>
          </div>
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-2xl bg-[#20150f] p-6 text-white md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/12">
              <Sparkles className="h-5 w-5 text-accentLight" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-heading text-3xl font-semibold">
              Built around a memorable scent trail
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/72">
              {product.name} is presented with a clear fragrance profile, selectable smell
              options, and product identifiers so customers can compare, remember, and reorder
              with confidence.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {heroNotes.map((note: string, index: number) => (
              <ScentNoteCard
                key={note}
                note={note}
                index={index}
                productName={product.name}
              />
            ))}
          </div>
        </section>

        <section
          id="detailed-description"
          className="mt-12 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
        >
          <div className="grid gap-0 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="bg-[#f7edd8] p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">
                Detail guide
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold">
                {product.name} fragrance story
              </h2>
              <div className="mt-6 grid gap-3">
                <GuideRow icon={<Clock3 className="h-4 w-4" />} label="Best for" value="Daily wear, gifting, evening plans" />
                <GuideRow icon={<PackageCheck className="h-4 w-4" />} label="Stock status" value={product.stock > 0 ? "Ready to ship" : "Temporarily unavailable"} />
                <GuideRow icon={<BadgeCheck className="h-4 w-4" />} label="Reference" value={product.modelNo} />
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div
                className="space-y-4 text-sm leading-7 text-textSecondary md:text-base [&_b]:text-textPrimary [&_li]:pl-1 [&_p]:max-w-4xl [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5 md:[&_ul]:grid-cols-2"
                dangerouslySetInnerHTML={{ __html: productDetailHtml }}
              />
            </div>
          </div>
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

function VisualStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/8 px-3 py-3 backdrop-blur">
      <p className="text-base font-semibold text-white">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-white/55">{label}</p>
    </div>
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
    <div className="rounded-lg border border-black/10 bg-[#fffbf2] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-textSecondary">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-textPrimary">{value}</p>
    </div>
  );
}

function TrustTile({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-lg border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#f6f0df] text-accent">
        {icon}
      </div>
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-1 text-xs leading-5 text-textSecondary">{text}</p>
    </article>
  );
}

function ScentNoteCard({
  note,
  index,
  productName,
}: {
  note: string;
  index: number;
  productName: string;
}) {
  const labels = ["Opening", "Heart", "Base", "Trail"];
  const tones = [
    "bg-[#fff3d8]",
    "bg-[#f2eadf]",
    "bg-[#eaf1e7]",
    "bg-[#f5e5db]",
  ];

  return (
    <article className={`rounded-2xl border border-black/10 p-5 ${tones[index % tones.length]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSecondary">
        {labels[index] ?? "Note"}
      </p>
      <h3 className="mt-3 font-heading text-3xl font-semibold">{note}</h3>
      <p className="mt-3 text-sm leading-6 text-textSecondary">
        A key part of {productName}&apos;s profile, selected to make the scent feel
        recognizable and polished.
      </p>
    </article>
  );
}

function GuideRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg bg-white/70 p-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-accent">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-textSecondary">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-textPrimary">{value}</p>
      </div>
    </div>
  );
}
