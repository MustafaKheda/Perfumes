import Image from "next/image";
import Newsletter from "@/components/common/Newsletter";

export const metadata = {
  title: "About SCENTORA | Timeless Scents, Kuwait",
  description:
    "Welcome to SCENTORA. Since 2000, we deliver premium, authentic fragrances in Kuwait—crafted to match every personality, mood, and occasion.",
};

export default function AboutPage() {
  return (
    <main className="max-w-[1300px] mx-auto px-4 font-body">
      <section className="mt-8 md:mt-12">
        <div className="relative w-full rounded-3xl overflow-hidden">
          <Image
            src="/images/about-bg.webp"
            alt="SCENTORA - premium fragrance experience"
            width={1600}
            height={600}
            className="w-full h-[240px] md:h-[320px] object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full px-5 md:px-8 pb-8">
              <h1 className="text-white font-heading text-3xl md:text-5xl tracking-wide">
                About SCENTORA
              </h1>
              <p className="text-white/90 mt-3 max-w-2xl text-sm md:text-base">
                Your destination for premium scents and perfumes in Kuwait.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <article className="lg:col-span-8">
            <div className="prose prose-invert max-w-none">
              <p>
                <strong>Welcome to SCENTORA</strong>, your destination for premium
                scents and perfumes in Kuwait.
              </p>

              <p>
                Since 2000, we have been dedicated to the world of fragrance,
                bringing our customers a carefully selected collection of perfumes
                that match every personality, mood, and occasion. What started as
                a passion for scents has grown into a trusted perfume business
                built on quality, authenticity, and customer satisfaction.
              </p>

              <p>
                At SCENTORA, we believe a perfume is more than just a fragrance.
                It is a memory, a statement, and a part of your identity.
                Whether you prefer fresh, floral, woody, oriental, or luxury-inspired
                scents, our collection is designed to help you find the perfect
                fragrance for yourself or your loved ones.
              </p>

              <p>
                With years of experience in the perfume industry, we understand
                what our customers love. Our goal is to offer high-quality
                perfumes at the best value, along with a smooth and reliable
                online shopping experience across Kuwait.
              </p>

              <h2>Why Choose SCENTORA?</h2>
              <ul>
                <li>Perfume business experience since 2000</li>
                <li>Wide collection of scents for men and women</li>
                <li>Quality fragrances at affordable prices</li>
                <li>Easy online shopping experience</li>
                <li>Trusted service in Kuwait</li>
              </ul>

              <p>
                At SCENTORA, every fragrance tells a story. Let us help you
                find yours.
              </p>

              <p>
                <strong>SCENTORA — Your scent, your identity.</strong>
              </p>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-black/10 bg-white/70 p-6 shadow-card">
              <h3 className="font-heading text-xl">Our promise</h3>
              <ul className="mt-4 space-y-3 text-textSecondary">
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accentLight" />
                  Premium & authentic selections
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accentLight" />
                  Best value for every fragrance
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accentLight" />
                  Smooth online shopping across Kuwait
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

