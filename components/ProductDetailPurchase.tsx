"use client";

import { useState } from "react";
import ProductDetailActions from "@/components/ProductDetailActions";
import ProductScentSelector from "@/components/ProductScentSelector";

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
}: ProductDetailPurchaseProps) {
  const [selectedScent, setSelectedScent] = useState(scentOptions[0] ?? "");

  return (
    <>
      <ProductScentSelector
        options={scentOptions}
        selected={selectedScent}
        onChange={setSelectedScent}
      />

      <div className="mt-7">
        <ProductDetailActions
          productId={productId}
          name={name}
          image={image}
          price={price}
          notes={notes}
          tag={tag}
          slug={slug}
          isWishlisted={isWishlisted}
          selectedScent={selectedScent}
        />
      </div>
    </>
  );
}
