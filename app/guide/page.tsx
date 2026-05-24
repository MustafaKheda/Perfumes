import Image from "next/image";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Heading } from "@/components/common/PageHeading";
import Newsletter from "@/components/common/Newsletter";
import BestSellersSection from "@/components/BestsellersSection";
import GuideCard from "@/components/common/GuideCard";

const guideCards = [
    {
        id: 1,
        title: "Discover Fragrance Notes",
        subtitle: "Understand the Layers",
        description:
            "Perfumes have top, heart, and base notes that unfold over time. Each layer plays a role in how the fragrance evolves on your skin.",
        points: [
            "Read about fragrance families like floral, woody, or musky.",
            "Smell your favorites to explore different fragrance families.",
            "Test before buying to see how it matches your body chemistry.",
        ],
        image: "/images/Guide/Guide1.webp",
    },
    {
        id: 2,
        title: "Select the Right Scent for You",
        subtitle: "Match Your Personality",
        description:
            "Light and fresh scents are great for energy; musk and amber notes for boldness. Choose one that suits your vibe and the occasion.",
        points: [
            "Pick scents for casual, date, or evening moods.",
            "Explore concentrations—Eau de Toilette is lighter, Parfum lasts longer.",
        ],
        image: "/images/Guide/Guide2.webp",
    },
    {
        id: 3,
        title: "Apply Perfume the Right Way",
        subtitle: "Use Perfume Perfectly",
        description:
            "Proper application enhances projection and longevity. Focus on pulse points and layering for a lasting effect.",
        points: [
            "Spray on wrists, neck, and behind ears.",
            "Avoid rubbing wrists together.",
            "Layer with body lotions or oils to enhance longevity.",
        ],
        image: "/images/Guide/Guide3.webp",
    },
    {
        id: 4,
        title: "Store & Maintain Your Perfume",
        subtitle: "Maintain Freshness",
        description:
            "Keep your perfume at its best by protecting it from heat and sunlight. Proper care ensures the scent stays true over time.",
        points: [
            "Store in a cool, dark place away from heat.",
            "Seal bottles tightly after each use.",
            "Use within 3–5 years for optimal freshness.",
        ],
        image: "/images/Guide/Guide4.webp",
    },
];

export const metadata = {
    title: "Scentora Perfumes | Guide",
    description:
        "Learn how to choose, apply, and store your perfume with Scentora’s expert guide. Discover your signature scent today.",
};

export default function GuidePage() {
    return (
        <main className="max-w-[1300px] mx-auto px-4 font-body">
            {/* Breadcrumb + Heading */}
            <Breadcrumb items={[{ label: "Guide", href: "/guide" }]} />
            <Heading
                text="Guide"
                subtitle="Discover the art of fragrance selection with our expert tips. Learn how to choose, apply, and care for your perfume to make every scent truly yours."
            />

            {/* Hero Banner */}
            <section className="my-10">
                <div className="w-full rounded-3xl overflow-hidden">
                    <Image
                        src="/images/Guide/guide-hero-banner.webp"
                        alt="Perfume bottles and flowers"
                        width={1600}
                        height={800}
                        className="object-cover  md:h-[550px] aspect-16/9 md:aspect-auto w-full"
                        priority

                    />
                </div>
                <Heading
                    fontSize="text-2xl md:text-4xl "
                    bottomBorderNeeded={false}
                    className="w-full mt-2"
                    text="Find Your Signature Scent — The Ultimate Perfume Guide"
                    subtitle="Discover the art of fragrance selection with our expert tips. Learn how to choose, apply, and care for your perfume to make every scent truly yours."
                />
            </section>

            {/* Guide Sections */}
            <section className="flex flex-col gap-12 py-10">
                {guideCards.map((card, i) => (
                    <GuideCard key={card.id} {...card} reverse={i % 2 === 0} />
                ))}
            </section>

            {/* Products + Best Sellers + Newsletter */}
            <section className="pt-12 pb-20 flex flex-col gap-y-16">
                <BestSellersSection />
                <Newsletter />
            </section>
        </main>
    );
}
