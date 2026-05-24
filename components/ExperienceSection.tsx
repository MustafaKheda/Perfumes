import Image from "next/image";
import { Leaf, Flower2, Recycle } from "lucide-react";

// export const metadata = {
//     title: "Experience Luxury & Elegance | Scentora Perfumes",
//     description:
//         "Discover the essence of luxury with Scentora perfumes — long-lasting fragrances crafted from natural ingredients in sustainable packaging.",
//     keywords: [
//         "Luxury perfume",
//         "Natural fragrances",
//         "Sustainable perfumes",
//         "Amber scent",
//         "Scentora Kuwait",
//     ],
//     openGraph: {
//         title: "Experience Luxury & Elegance | Scentora",
//         description:
//             "Elevate your senses with long-lasting, natural, and sustainable fragrances by Scentora.",
//         type: "website",
//         url: "https://yourdomain.com",
//         images: [
//             {
//                 url: "https://yourdomain.com/og-experience.jpg",
//                 width: 1200,
//                 height: 630,
//                 alt: "Luxury fragrance bottle and model applying perfume",
//             },
//         ],
//     },
// };

export default function ExperienceSection() {
    const features = [
        {
            id: 1,
            icon: <Flower2 className="w-full h-full text-accent" />,
            title: "Long-Lasting Fragrance",
            desc: "Enjoy all-day freshness with premium essential oils.",
        },
        {
            id: 2,
            icon: <Leaf className="w-full h-full text-accent" />,
            title: "Finest Natural Ingredients",
            desc: "Crafted with rare and high-quality extracts for a luxurious scent.",
        },
        {
            id: 3,
            icon: <Recycle className="w-full h-full text-accent" />,
            title: "Sustainable & Ethical",
            desc: "Eco-friendly packaging and responsibly sourced materials.",
        },
    ];

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Brand",
        name: "Scentora",
        slogan: "Experience Luxury & Elegance",
        description:
            "Premium fragrances combining long-lasting freshness, natural ingredients, and sustainable packaging.",
        logo: "https://yourdomain.com/logo.png",
        sameAs: [
            "https://www.instagram.com/scentora",
            "https://www.facebook.com/scentora",
        ],
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Fragrance Features",
            itemListElement: features.map((f, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: f.title,
                description: f.desc,
            })),
        },
    };

    return (
        <section
            id="experience"
            className="  text-textPrimary "
            aria-labelledby="experience-heading"
        >
            <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row justify-between gap-8 md:gap-14">
                {/* --- Left Text Content --- */}
                <div className="flex-1">
                    <h2
                        id="experience-heading"
                        className="text-3xl md:text-5xl font-heading leading-tight"
                    >
                        EXPERIENCE LUXURY <span className="font-normal">&</span> ELEGANCE
                    </h2>
                    <p className="text-textPrimary font-medium  max-w-md">
                        Our fragrances are crafted to elevate your senses and leave a lasting impression.
                    </p>

                    <ul className="space-y-4 mx-5 mt-6" aria-label="Fragrance highlights">
                        {features.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-start gap-5"
                                itemScope
                                itemType="https://schema.org/ListItem"
                            >
                                <div className="mt-1 flex items-center justify-center w-10 h-10" aria-hidden="true">
                                    {item.icon}
                                </div>
                                <div className="max-w-xs">
                                    <h3 className="text-accent font-semibold ">
                                        {item.title}
                                    </h3>
                                    <p className="text-textPrimary font-medium text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* --- Right Image Composition --- */}
                <div className="relative w-[250px] h-[350px] md:w-[350px] md:h-[450px] mx-auto">
                    {/* Inner Circular Bottle Image */}
                    <div className="absolute -left-20 md:-left-30 z-10 bottom-15 md:bottom-15 w-40 h-[220px] md:w-[250px] md:h-[330px] p-2 ">
                        <div className="relative w-full h-full rounded-full overflow-hidden ">
                            <Image
                                src="/images/perfume-bottle-sand.webp"
                                alt="Amber perfume bottle lying on sand"
                                fill
                                className="object-center"
                                loading="lazy"
                            />
                        </div>
                        {/* Decorative outline ring */}
                        <div className="absolute inset-0 rounded-full border border-borderRing " />
                    </div>

                    {/* Main Model Image */}
                    <div className="relative w-full h-full rounded-4xl overflow-hidden shadow-img">
                        <Image
                            src="/images/perfume-model.webp"
                            alt="Woman applying perfume on wrist wearing green sweater"
                            fill
                            className="object-cover"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>

            {/* ✅ JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </section >
    );
}
