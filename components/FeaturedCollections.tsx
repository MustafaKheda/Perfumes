import Image from "next/image";
import Link from "next/link";
import SectionHeading from "./SectionHeading";
import ArrowIcon from "./common/ArrowIcon";
import CommonLink from "./common/CommonLink";
import CollectionCard from "./common/CollectionCard";

const collections = [
    {
        name: "Men’s Collection",
        count: "120+ Products",
        images: [
            "/images/Perfume/34.webp",
            "/images/Perfume/26.webp",
            "/images/Perfume/33.jpg",
            "/images/Perfume/25.webp",
        ],
    },
    {
        name: "Women’s Collection",
        count: "140+ Products",
        images: [
            "/images/Perfume/18.webp",
            "/images/Perfume/30.webp",
            "/images/Perfume/35.webp",
            "/images/Perfume/21.webp",
        ],
    },
    {
        name: "Luxury Collection",
        count: "340+ Products",
        images: [
            "/images/Perfume/32.webp",
            "/images/Perfume/37.webp",
            "/images/Perfume/31.webp",
            "/images/Perfume/36.webp",
        ],
    },
];

export default function FeaturedCollections() {
    return (
        <section className="font-body">
            <SectionHeading
                title="DISCOVER FEATURED"
                highlight="COLLECTIONS"
                subtitle="From timeless classics to limited editions, find the perfect fragrance for every moment."
            />

            <div className="grid md:grid-cols-3 gap-10">
                {collections.map((col, i) => (
                    <CollectionCard key={i} {...col} />
                ))}
            </div>
        </section>
    );
}
