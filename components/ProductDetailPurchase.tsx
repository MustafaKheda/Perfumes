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
  selectedScent?: string;
  onSelectedScentChange?: (value: string) => void;
  hideSelector?: boolean;
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
  selectedScent: controlledSelectedScent,
  onSelectedScentChange,
  hideSelector = false,
}: ProductDetailPurchaseProps) {
  const hasVariants = variants.length > 0;
  const initialOption = hasVariants ? variants[0]?.name ?? "" : scentOptions[0] ?? "";
  const [uncontrolledSelectedScent, setUncontrolledSelectedScent] =
    useState(initialOption);
  const selectedScent = controlledSelectedScent ?? uncontrolledSelectedScent;
  const setSelectedScent =
    onSelectedScentChange ??
    ((value: string) => {
      setUncontrolledSelectedScent(value);
    });

  const activeVariant = hasVariants
    ? variants.find((variant) => variant.name === selectedScent) ?? variants[0] ?? null
    : null;

  // Matrix concept: if the parent has variants, always show the selector so users can
  // explicitly choose the smell (even if only 1 variant exists).
  const showSelector = hasVariants ? variants.length > 0 : scentOptions.length > 1;
  const activeProductId = activeVariant?.id ?? productId;
  const activeImage = activeVariant?.image ?? image;
  const activePrice = activeVariant?.price ?? price;

  return (
    <>
      {showSelector && !hideSelector ? (
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
