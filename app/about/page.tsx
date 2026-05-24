import Image from "next/image";
import Newsletter from "@/components/common/Newsletter";

export const metadata = {
  title: "About SCENTORA | Timeless Scents, Kuwait",
  description:
    "Welcome to SCENTORA, founded in Kuwait in 2000. Discover premium, authentic fragrances crafted for elegance, individuality, and timeless luxury.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-[1300px] px-4 font-body">
      <section className="mt-8 md:mt-12">
        <div className="relative w-full overflow-hidden rounded-lg">
          <Image
            src="/images/about-bg.webp"
            alt="SCENTORA premium fragrance experience"
            width={1600}
            height={600}
            className="h-[240px] w-full object-cover md:h-[320px]"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-5 pb-8 md:px-8">
              <h1 className="font-heading text-3xl tracking-wide text-white md:text-5xl">
                Our Story
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/90 md:text-base">
                Crafting unforgettable fragrance experiences since 2000.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <article className="lg:col-span-8">
            <div className="max-w-none space-y-5 text-[15px] leading-7 text-textSecondary md:text-base">
              <p className="font-heading text-2xl leading-tight text-textPrimary md:text-3xl">
                Welcome to SCENTORA, where fragrance meets elegance, tradition,
                and timeless luxury.
              </p>

              <p>
                Founded in Kuwait in the year 2000, SCENTORA has been dedicated
                to bringing the finest collection of perfumes and fragrances to
                customers who appreciate quality, sophistication, and
                individuality. With over two decades of experience in the perfume
                industry, we have built a trusted name known for authenticity,
                excellence, and a deep passion for scents.
              </p>

              <p>
                At SCENTORA, we believe that a fragrance is more than just a
                scent. It is a personal statement, a memory, and an expression of
                identity. Our carefully curated collection includes a wide
                variety of perfumes ranging from luxurious Arabic oud and
                oriental fragrances to modern international perfumes crafted for
                every personality and occasion.
              </p>

              <p>
                Over the years, we have proudly served thousands of customers
                across Kuwait and beyond, continuously evolving to meet changing
                trends while staying true to our commitment to premium quality
                and customer satisfaction.
              </p>

              <div className="border-l-2 border-accentLight pl-5">
                <h2 className="font-heading text-2xl font-semibold text-textPrimary">
                  Our Mission
                </h2>
                <p className="mt-3">
                  To provide exceptional fragrances that inspire confidence,
                  elegance, and unforgettable experiences.
                </p>
              </div>

              <p>
                Whether you are searching for a signature scent, a thoughtful
                gift, or a luxurious everyday fragrance, SCENTORA is here to help
                you discover perfumes that truly reflect your style and
                personality.
              </p>

              <p>Thank you for being a part of our journey.</p>

              <p className="font-heading text-xl font-semibold text-textPrimary">
                SCENTORA
                <span className="mt-1 block text-sm font-normal text-textSecondary">
                  Crafting unforgettable fragrance experiences since 2000.
                </span>
              </p>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-6 rounded-lg border border-black/10 bg-white/80 p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Why Choose SCENTORA?
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold">
                Perfume expertise rooted in Kuwait
              </h2>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-textSecondary">
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accentLight" />
                  Established and trusted since 2000
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accentLight" />
                  Wide range of premium perfumes and fragrances
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accentLight" />
                  Authentic products with high-quality standards
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accentLight" />
                  Passion for luxury, elegance, and customer satisfaction
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accentLight" />
                  Dedicated online shopping experience for fragrance lovers
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-14 md:pb-20">
        <Newsletter />
      </section>
    </main>
  );
}
