import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BestSellers from "./Bestsellers";

export default function Hero() {
  return (
    <div className="w-full xl:w-[60%] flex flex-col pt-10 md:pb-16">
      {/* HEADLINE */}
      <h1 className="font-heading font-semibold leading-[1.05] text-[2.2rem] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.4rem] xl:text-[3.2rem] text-textPrimary tracking-tight">
        <span className="block">TIMELESS <span className="text-accent">SCENTS,</span></span>
        <span className="block">LASTING IMPRESSIONS.</span>
      </h1>

      {/* DESCRIPTION */}
      <p className="mt-6 text-textSecondary font-body text-[0.9rem] sm:text-[1rem] leading-relaxed max-w-[640px]">
        Experience the art of fine fragrance, crafted for elegance and individuality.
        Each drop tells a story, blending timeless notes with modern sophistication.
        Discover your signature scent and leave a lasting impression.
      </p>

      {/* CTA ROW */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8">
        
        {/* Explore button */}
        <Link
          href="/shop/all"
          className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-textPrimary bg-textPrimary px-5 py-3 font-body text-sm font-semibold text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-textPrimary hover:shadow-md active:translate-y-0"
          aria-label="Explore Shop"
        >
          <span className="whitespace-nowrap">Explore Shop</span>
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-textPrimary transition group-hover:translate-x-0.5 group-hover:bg-textPrimary group-hover:text-white">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </Link>

        {/* Avatars + trust */}
        <div className="flex items-center gap-3">
          {/* avatars */}
          <div className="flex -space-x-2">
            <Image
              src="/images/perfume-amber.png"
              alt="Customer 1"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full border-2 border-pageBg object-cover shadow-card"
            />
            <Image
              src="/images/perfume-blue.webp"
              alt="Customer 2"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full border-2 border-pageBg object-cover shadow-card"
            />
            <Image
              src="/images/perfume-silver.png"
              alt="Customer 3"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full border-2 border-pageBg object-cover shadow-card"
            />
          </div>

          {/* text */}
          <div className="text-[0.8rem] leading-tight font-body">
            <div className="font-semibold text-textPrimary">25k+</div>
            <div className="text-textSecondary">Trusted Users</div>
          </div>
        </div>
      </div>
      {/* Best seller section */}
      <BestSellers />
    </div>
  );
}
