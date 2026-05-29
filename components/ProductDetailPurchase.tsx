"use client";

import { useState } from "react";
import ProductDetailActions from "@/components/ProductDetailActions";
import ProductScentSelector from "@/components/ProductScentSelector";

type ProductVariant = {
  id: string;
  name: string;
  image: string;
  price: number;
};

type ProductDetailPurchaseProps = {
  productId: string;
  name: string;
  image: string;
  price: number;
  notes: string;
  tag?: string | null;
  slug?: string;
  isWishlisted?: boolean;
  scentOptions: string[];
  variants?: ProductVariant[];
};

export default function ProductDetailPurchase({
  productId,
  name,
  image,
  price,
  notes,
  tag,
  slug,
  isWishlisted,
  scentOptions,
  variants = [],
}: ProductDetailPurchaseProps) {
  const hasVariants = variants.length > 0;
  const initialOption = hasVariants ? variants[0]?.name ?? "" : scentOptions[0] ?? "";
  const [selectedScent, setSelectedScent] = useState(initialOption);

  const activeVariant = hasVariants
    ? variants.find((variant) => variant.name === selectedScent) ?? variants[0] ?? null
    : null;

  const showSelector = (hasVariants ? variants.length : scentOptions.length) > 1;
  const activeProductId = activeVariant?.id ?? productId;
  const activeImage = activeVariant?.image ?? image;
  const activePrice = activeVariant?.price ?? price;

  return (
    <>
      {showSelector ? (
        <ProductScentSelector
          options={hasVariants ? variants.map((variant) => variant.name) : scentOptions}
          selected={selectedScent}
          onChange={setSelectedScent}
        />
      ) : null}

      <div className="mt-7">
        <ProductDetailActions
          productId={activeProductId}
          name={name}
          image={activeImage}
          price={activePrice}
          notes={notes}
          tag={tag}
          slug={slug}
          isWishlisted={isWishlisted}
          selectedScent={showSelector ? selectedScent : undefined}
        />
      </div>
    </>
  );
}
