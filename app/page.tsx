
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
    "Discover SCENTORA’s luxurious perfumes crafted with the finest ingredients. Explore men’s, women’s, unisex and luxury collections that define sophistication.",
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
        url: "/images/og-banner.jpg",
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
    <main className="flex flex-col min-h-screen ">

      {/* HERO + PRODUCTS */}
      <section className="flex flex-col gap-x-10 md:gap-0 md:flex-row max-w-[1300px]  w-full mx-auto pl-4 lg:pl-6 relative">
        <Hero />

        {/* Right visual bottle */}
        <aside className="relative w-full xl:w-[40%] flex items-end justify-center xl:justify-end">
          <div className="relative rounded-tl-none rounded-tr-none rounded-br-none rounded-bl-none   w-full h-full flex items-end justify-center xl:justify-end">
            {/* bottle / hand image */}
            <div className="relative max-w-[420px] xl:max-w-[480px]">
              <img
                src="/images/hero.webp"
                alt="Premium perfume bottle held in hand"
                className="w-full h-auto object-contain"
                loading="eager"
                fetchPriority="high"

              />
            </div>
          </div>
        </aside>
      </section>
      {/* BOTTOM MARQUEE BAR */}
      <FooterMarquee />
      <CategorySection />
      <section className="flex flex-col max-w-[1300px] gap-y-16 py-10 md:py-16  w-full mx-auto px-4" >
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
