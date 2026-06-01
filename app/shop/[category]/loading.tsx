 "use client";

import { Skeleton } from "boneyard-js/react";
import ProductCardLarge from "@/components/ProductCardLarge";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Heading } from "@/components/common/PageHeading";
import { FilterBar } from "@/components/Filterbar";

export default function Loading() {
  const fixtures = Array.from({ length: 12 }).map((_, idx) => (
    <ProductCardLarge
      key={`fixture-${idx}`}
      productId="00000000-0000-0000-0000-000000000000"
      image="/images/perfume-blue.webp"
      name="Loading perfume"
      notes="Amber, Vanilla, Sandalwood"
      price="0.00"
      tag="NEW"
      slug="loading"
      isWishlisted={false}
    />
  ));

  return (
    <main className="mx-auto min-h-screen max-w-[1300px] px-4 font-body">
      <Breadcrumb
        items={[
          { label: "Shop", href: "/" },
          { label: "All Perfume", href: "/shop/all" },
        ]}
      />

      <Heading
        text="Loading perfumes"
        count={0}
        Filter={<FilterBar currentCategory="all" />}
      />

      <Skeleton
        name="shop-grid"
        loading
        fixture={
          <div className="mb-10 flex flex-wrap gap-4">
            {fixtures}
          </div>
        }
      >
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {fixtures}
        </div>
      </Skeleton>
    </main>
  );
}
