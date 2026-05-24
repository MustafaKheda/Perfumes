"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import CommonLink from "./CommonLink";

interface ProductCardWideProps {
    productId?: string;
    image: string;
    name: string;
    tagline?: string;
    description: string;
    price: string;
    stockText?: string;
    features?: string;
    notes?: string;
}

export default function ProductCardWide({
    productId,
    image,
    name,
    tagline = "Embrace the Mystery of the Night",
    description,
    price,
    stockText = "Only have 25 Products",
    features,
    notes,
}: ProductCardWideProps) {
    const router = useRouter();
    const [adding, setAdding] = useState(false);

    async function addToCart() {
        if (!productId) {
            return;
        }

        setAdding(true);

        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: 1 }),
            });

            if (response.status === 401) {
                router.push("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Unable to add item");
            }

            window.dispatchEvent(new Event("scentora:cart-updated"));
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row rounded-3xl gap-5 sm:gap-10 overflow-hidden  transition-all duration-300">
            {/* Left - Image */}
            <div className="relative w-full sm:w-5/12 aspect-square overflow-hidden rounded-3xl shadow-md">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                    priority
                />
            </div>

            {/* Right - Content */}
            <div className="w-full sm:flex-1 flex flex-col justify-center text-textPrimary">
                <h2 className="font-heading text-5xl font-semibold mb-1">
                    {name}
                </h2>
                <p className="mb-4">{tagline}</p>

                {/* Price & stock */}
                <div className="flex items-center gap-3 mb-5">
                    <p className="text-xl font-semibold text-accent">
                        ${price}
                    </p>
                    <span className="bg-[#FFEBCB] text-accent text-sm font-medium px-3 py-1 rounded-full">
                        {stockText}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm  mb-4 leading-relaxed ">
                    {description}
                </p>

                {/* Features */}
                {features && (
                    <p className="text-sm mb-2">
                        <span className="font-semibold text-textPrimary ">
                            Special Features:
                        </span>{" "}
                        {features}
                    </p>
                )}

                {/* Notes */}
                {notes && (
                    <p className="text-sm mb-8">
                        <span className="font-semibold text-textPrimary">
                            Notes:
                        </span>{" "}
                        {notes}
                    </p>
                )}

                {/* Buttons */}
                <div className="flex items-center gap-4">
                    <CommonLink inverse className="flex-1">
                        Buy Now
                    </CommonLink>

                    <button
                        onClick={addToCart}
                        disabled={!productId || adding}
                        className="border w-1/2 border-textPrimary justify-center py-3 font-semibold rounded-full text-sm flex items-center gap-2 hover:bg-[#3b3b3b] hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {adding ? "Adding..." : "Add to Bag"} <ShoppingBag size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
