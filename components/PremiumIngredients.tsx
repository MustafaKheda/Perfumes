// components/PremiumIngredients.tsx
import Image from "next/image";
import CommonLink from "./common/CommonLink";

export default function PremiumIngredients() {
    return (
        <section className="">
            <div className="max-w-[1150px] mx-auto flex flex-col md:flex-row items-center gap-5 md:gap-15">
                {/* Left - Image */}
                <div className="max-w-full h-100 md:h-auto md:flex-1">
                    <div className="rounded-3xl overflow-hidden shadow-card">
                        <Image
                            src="/images/about-bg.webp" // <-- replace with your actual path or imported image
                            alt="Woman applying perfume"
                            width={600}
                            height={600}
                            className="object-cover w-full h-full"
                            priority
                            // loading="lazy"
                        />
                    </div>
                </div>

                {/* Right - Text */}
                <div className="w-full md:w-1/2 text-textPrimary font-body">
                    <h2 className="font-heading text-3xl md:text-4xl leading-snug mb-4">
                        PREMIUM INGREDIENTS
                        <br />
                        THE ESSENCE OF LUXURY
                    </h2>
                    <p className="text-textSecondary text-base md:text-[15px] leading-relaxed mb-6">
                        Our perfumes are crafted with natural, high-quality ingredients for
                        a rich and lasting scent. A perfect blend of floral, woody, citrus,
                        and warm notes creates elegance and depth. Cruelty-free and free
                        from harsh chemicals, ensuring a pure luxury experience.
                    </p>

                    <CommonLink inverse href="/about" className="mb-4 inline-block">
                        Learn More
                    </CommonLink>
                </div>
            </div>
        </section>
    );
}
