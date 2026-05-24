import SectionHeading from "./SectionHeading";
import FilterTabs from "./FilterTabs";
import ProductCard from "./ProductCardLarge";

const products = [
    {
        id: 1,
        image: "/images/Perfume/1.webp",
        name: "Noir Mystique",
        notes: "Oud, Bergamot, Amber",
        price: "120.00",
        tag: "HOT",
        category: "men",
    },
    {
        id: 2,
        image: "/images/Perfume/2.webp",
        name: "Velvet Bloom",
        notes: "Rose, Vanilla, Musk",
        price: "135.00",
        tag: "HOT",
        category: "women",
    },
    {
        id: 3,
        image: "/images/Perfume/9.webp",
        name: "Amber Dusk",
        notes: "Amber, Cedarwood, Jasmine",
        price: "110.00",
        tag: "NEW",
        category: "unisex",
    },
    {
        id: 4,
        image: "/images/Perfume/31.webp",
        name: "Amber Dusk",
        notes: "Amber, Cedarwood, Jasmine",
        price: "110.00",
        tag: "NEW",
        category: "men",
    },
    {
        id: 6,
        image: "/images/Perfume/35.webp",
        name: "Amber Dusk",
        notes: "Amber, Cedarwood, Jasmine",
        price: "110.00",
        tag: "NEW",
        category: "unisex",
    },
    {
        id: 7,
        image: "/images/Perfume/18.webp",
        name: "Noir Mystique",
        notes: "Oud, Bergamot, Amber",
        price: "120.00",
        tag: "HOT",
        category: "men",
    },
    {
        id: 8,
        image: "/images/Perfume/30.webp",
        name: "Velvet Bloom",
        notes: "Rose, Vanilla, Musk",
        price: "135.00",
        tag: "HOT",
        category: "women",
    },
    {
        id: 9,
        image: "/images/Perfume/7.webp",
        name: "Noir Mystique",
        notes: "Oud, Bergamot, Amber",
        price: "120.00",
        tag: "HOT",
        category: "women",
    },
    {
        id: 10,
        image: "/images/Perfume/37.webp",
        name: "Noir Mystique",
        notes: "Oud, Bergamot, Amber",
        price: "120.00",
        tag: "HOT",
        category: "women",
    },
    {
        id: 11,
        image: "/images/Perfume/32.webp",
        name: "Velvet Bloom",
        notes: "Rose, Vanilla, Musk",
        price: "135.00",
        tag: "HOT",
        category: "women",
    },
    {
        id: 12,
        image: "/images/Perfume/20.webp",
        name: "Amber Dusk",
        notes: "Amber, Cedarwood, Jasmine",
        price: "110.00",
        tag: "NEW",
        category: "men",
    },
];

export default function FragranceSection() {


    // Structured data (JSON-LD)
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Scentora Fragrance Collection",
        itemListElement: products.map((p, index) => ({
            "@type": "Product",
            position: index + 1,
            name: p.name,
            image: `https://yourdomain.com${p.image}`,
            description: `${p.notes} perfume`,
            offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: p.price,
                availability: "https://schema.org/InStock",
            },
        })),
    };

    return (
        <section
            id="fragrances"
            className=""
            aria-labelledby="fragrance-heading"
        >
            <SectionHeading
                title="INDULGE IN EXQUISITE"
                highlight="FRAGRANCES"
                subtitle="Discover our signature scents crafted with elegance, sophistication, and timeless allure."
            />
            <FilterTabs />

            <div
                className=" flex snap-x snap-mandatory gap-3 overflow-x-auto  [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                itemScope
                itemType="https://schema.org/ItemList"
            >
                {products.map((p) => (
                    <article key={p.id} itemProp="itemListElement" className="snap-start shrink-0 w-[340px]">
                        <ProductCard {...p} />
                    </article>
                ))}
            </div>

            {/* ✅ JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
        </section>
    );
}
