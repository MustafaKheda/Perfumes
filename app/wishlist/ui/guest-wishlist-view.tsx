"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCardLarge";
import { Heading } from "@/components/common/PageHeading";
import { getGuestWishlist, type GuestWishlistItem } from "@/lib/guest-wishlist";

export default function GuestWishlistView() {
  const [items, setItems] = useState<GuestWishlistItem[]>([]);

  useEffect(() => {
    function loadWishlist() {
      setItems(getGuestWishlist());
    }

    loadWishlist();
    window.addEventListener("scentora:wishlist-updated", loadWishlist);

    return () => {
      window.removeEventListener("scentora:wishlist-updated", loadWishlist);
    };
  }, []);

  return (
    <>
      <Heading text="Wishlist" count={items.length} />

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-wrap mb-10">
          {items.map((product) => (
            <ProductCard
              key={product.productId}
              productId={product.productId}
              image={product.image}
              name={product.name}
              slug={product.slug}
              notes={product.notes ?? ""}
              price={product.price.toFixed(2)}
              tag={product.tag}
              isWishlisted
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-textSecondary py-10">
          Your wishlist is empty.
        </p>
      )}
    </>
  );
}
