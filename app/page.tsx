import Image from "next/image";
import Hero from "@/components/Hero";
import FooterMarquee from "@/components/FooterMarquee";
import CategorySection from "@/components/CategorySection";
import FragranceSection from "@/components/FragranceSection";
import ExperienceSection from "@/components/ExperienceSection";
import FeaturedCollections from "@/components/FeaturedCollections";
import PremiumIngredients from "@/components/PremiumIngredients";
import BestSellersSection from "@/components/BestsellersSection";
import Newsletter from "@/components/common/Newsletter";

export const metadata = {
  title: "SCENTORA | Timeless Scents & Lasting Impressions",
  description:
    "Discover SCENTORA's luxurious perfumes crafted with the finest ingredients. Explore men's, women's, unisex and luxury collections that define sophistication.",
  keywords:
    "perfume, fragrance, scent, luxury perfumes, men's perfume, women's perfume, unisex scents, SCENTORA",
  openGraph: {
    title: "SCENTORA | Luxury Perfumes for Men & Women",
    description:
      "Explore premium fragrances that blend modern artistry and timeless elegance.",
    url: "https://scentora.com",
    siteName: "SCENTORA",
    images: [
      {
        url: "/images/hero.webp",
        width: 1200,
        height: 630,
        alt: "Luxury perfume bottle from SCENTORA",
      },
    ],
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <section className="relative mx-auto flex w-full max-w-[1300px] flex-col gap-x-10 pl-4 md:flex-row md:gap-0 lg:pl-6">
        <Hero />

        <aside className="relative flex w-full items-end justify-center xl:w-[40%] xl:justify-end">
          <div className="flex h-full w-full items-end justify-center xl:justify-end">
            <div className="relative max-w-[420px] xl:max-w-[480px]">
              <Image
                src="/images/hero.webp"
                alt="Premium perfume bottle held in hand"
                width={480}
                height={640}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>
        </aside>
      </section>

      <FooterMarquee />
      <CategorySection />
      <section className="mx-auto flex w-full max-w-[1300px] flex-col gap-y-16 px-4 py-10 md:py-16">
        <FragranceSection />
        <ExperienceSection />
        <FeaturedCollections />
        <PremiumIngredients />
        <BestSellersSection />
        <Newsletter />
      </section>
    </main>
  );
}
