import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "./common/ArrowIcon";

export default function CategorySection() {
    const categories = [
        {
            title: "MEN'S FRAGRANCES",
            subtitle: "Best Men's Collection",
            href: "/shop/men",
            highlight: false,
        },
        {
            title: "WOMEN'S FRAGRANCES",
            subtitle: "Best Women's Collection",
            href: "/shop/women",
            highlight: false,
        },
        {
            title: "UNISEX SCENTS",
            subtitle: "Special Scents",
            href: "/collections/unisex",
            highlight: false,
        },
        {
            title: "LUXURY COLLECTION",
            subtitle: "Luxury Scent for Both",
            href: "/collections/luxury",
            highlight: false,
        },
    ];

    return (
        <section
            className=" text-textPrimary pt-16"
            id="categories"
        >
            <div className="flex items-center max-w-[1300px] mx-auto justify-between  px-4">
                <h2 className="text-xl font-heading font-semibold uppercase tracking-wider">
                    Categories
                </h2>
                <Link
                    href="/collections"
                    className="inline-flex items-center gap-2 border rounded-pill  pl-4 pr-1 py-1 text-sm text-white bg-[#3b3b3b] transition"
                >
                    View All  <div className="bg-white rounded-full p-2 flex items-center justify-center">
                        <ArrowIcon className="text-textPrimary" size={16} />

                    </div>
                </Link>
            </div>
            <div className=" max-w-[1250px] mx-auto flex  gap-12 items-center px-6">

                {/* Left Image */}
                <div className="flex justify-center lg:justify-start">
                    <Image
                        src="/images/upscalemedia-transformed.png"
                        alt="Luxury amber perfume bottle on pastel stairs"
                        width={380}
                        height={420}
                        className="rounded-soft shadow-img object-cover"
                        priority
                    />
                </div>

                {/* Right Section */}
                <div className="flex-1">
                    {/* Category List */}
                    <div className="space-y-6">
                        {categories.map((cat, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between border-b border-[#d6c6a1] pb-3 group"
                            >
                                <div>
                                    <Link href={cat.href}>
                                        <h3
                                            className={`text-lg font-heading tracking-wide transition-colors text-textPrimary group-hover:text-accent`}
                                        >
                                            {cat.title}  <span className="text-[13px] text-textSecondary mt-1"> / {cat.subtitle}  </span>
                                        </h3>
                                    </Link>

                                </div>

                                <Link
                                    href={cat.href}
                                    className={`flex items-center justify-center w-8 h-8 rounded-full border transition 
                                         border-borderRing text-textPrimary group-hover:bg-textPrimary group-hover:text-white                                        `}
                                >
                                    <ArrowIcon size={16} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Brand Section */}
            <div className="bg-[var(--color-textPrimary)] text-[var(--color-pageBg)] text-center mt-20 py-16 px-6">
                <p className="max-w-xl mx-auto text-[20px] leading-relaxed font-heading tracking-wide">
                    AT{" "}
                    <span className="text-accent font-semibold">
                        SCENTORA
                    </span>
                    , WE BELIEVE FRAGRANCE IS MORE THAN JUST A SCENT — IT’S AN EXPERIENCE.
                    OUR PERFUMES ARE CRAFTED WITH THE FINEST INGREDIENTS, BLENDING
                    TRADITION AND MODERN ARTISTRY TO CREATE UNFORGETTABLE FRAGRANCES.
                </p>

                <Link
                    href="/about"
                    className="mt-8 inline-flex items-center gap-2 border rounded-pill pl-4 pr-1 py-1 text-sm bg-white text-textPrimary transition"
                >
                    Learn More
                    <div className="bg-textPrimary rounded-full p-3 flex items-center justify-center">
                        <ArrowIcon className="text-white" size={16} />

                    </div>
                </Link>
            </div>
        </section>
    );
}
