"use client";

import * as React from "react";
import Image from "next/image";
import { Gift, ShieldCheck, Truck } from "lucide-react";
import ProductDetailPurchase from "@/components/ProductDetailPurchase";
import ProductScentSelector from "@/components/ProductScentSelector";

type Variant = {
  id: string;
  name: string;
  modelNo: string;
  image: string;
  price: number;
  stock: number;
};

type ProductDetailVariantClientProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    image: string;
    modelNo: string;
    description: string;
    price: number;
    stock: number;
    notes: string[];
    scentOptions: string[];
    tag?: string | null;
    categoryDetails: { name: string };
  };
  collectionLabel: string;
  heroNotes: string[];
  variants: Variant[];
  isWishlisted: boolean;
};

export default function ProductDetailVariantClient({
  product,
  collectionLabel,
  heroNotes,
  variants,
  isWishlisted,
}: ProductDetailVariantClientProps) {
  const hasVariants = variants.length > 0;
  const scentOptions = hasVariants
    ? variants.map((variant) => variant.name)
    : product.scentOptions.length > 0
      ? product.scentOptions
      : product.notes.slice(0, 6);

  const initialSelected = scentOptions[0] ?? "";
  const [selectedScent, setSelectedScent] = React.useState(initialSelected);

  const activeVariant = hasVariants
    ? variants.find((variant) => variant.name === selectedScent) ?? variants[0] ?? null
    : null;

  const displayName = activeVariant?.name ?? product.name;
  const displayModelNo = activeVariant?.modelNo ?? product.modelNo;
  const displayImage = activeVariant?.image ?? product.image;
  const displayPrice = activeVariant?.price ?? product.price;
  const displayStock = activeVariant?.stock ?? product.stock;

  return (
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
              {displayModelNo}
            </span>
          </div>

          <div className="relative mx-auto my-8 aspect-[4/5] w-[min(78vw,430px)] overflow-hidden rounded-2xl bg-white/8 shadow-[0_35px_80px_rgba(0,0,0,0.42)] ring-1 ring-white/14 sm:w-[min(58vw,460px)]">
            <Image
              src={displayImage}
              alt={`${displayName} perfume bottle`}
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
                {heroNotes.map((note) => (
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
            <VisualStat value={displayStock > 0 ? `${displayStock}` : "0"} label="In stock" />
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
            {displayName}
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
                ${displayPrice.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-[#f6f0df] px-4 py-3 text-sm font-semibold text-textPrimary">
              {displayStock > 0 ? `${displayStock} pieces available` : "Out of stock"}
            </div>
          </div>

          {hasVariants ? (
            <ProductScentSelector
              options={scentOptions}
              selected={selectedScent}
              onChange={setSelectedScent}
            />
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <DetailItem label="Model no" value={displayModelNo} />
            <DetailItem label="Category" value={product.categoryDetails.name} />
            <DetailItem label="Notes" value={product.notes.join(", ") || "Signature blend"} />
            <DetailItem label="Collections" value={collectionLabel} />
          </div>

          <ProductDetailPurchase
            productId={product.id}
            name={displayName}
            image={displayImage}
            price={displayPrice}
            notes={product.notes.join(", ")}
            tag={product.tag}
            slug={product.slug}
            isWishlisted={isWishlisted}
            scentOptions={scentOptions}
            variants={variants.map((variant) => ({
              id: variant.id,
              name: variant.name,
              image: variant.image,
              price: variant.price,
            }))}
            selectedScent={hasVariants ? selectedScent : undefined}
            onSelectedScentChange={hasVariants ? setSelectedScent : undefined}
            hideSelector={hasVariants}
          />
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <TrustTile icon={<Truck className="h-4 w-4" />} title="Next day" text="Fast local delivery window." />
          <TrustTile icon={<ShieldCheck className="h-4 w-4" />} title="Authentic" text="Catalog managed product." />
          <TrustTile icon={<Gift className="h-4 w-4" />} title="Gift ready" text="Premium presentation." />
        </section>
      </div>
    </div>
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
