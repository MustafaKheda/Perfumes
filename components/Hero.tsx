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
        <button
          className="flex items-center gap-2 bg-btnAccent text-black text-[0.9rem] font-medium font-body rounded-pill pl-4 pr-4 py-3 shadow-card border border-black/10 hover:scale-[1.03] active:scale-[0.99] transition-transform"
          aria-label="Explore Shop"
        >
          <span>Explore Shop</span>
          <span className="flex items-center justify-center h-8 w-8 rounded-full border border-black/40 bg-white/20">
            {/* arrow icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              className="text-black"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </button>

        {/* Avatars + trust */}
        <div className="flex items-center gap-3">
          {/* avatars */}
          <div className="flex -space-x-2">
            <img
              src="/images/user1.jpg"
              alt="Customer 1"
              className="h-9 w-9 rounded-full border-2 border-pageBg object-cover shadow-card"
              loading="lazy"
            />
            <img
              src="/images/user2.jpg"
              alt="Customer 2"
              className="h-9 w-9 rounded-full border-2 border-pageBg object-cover shadow-card"
              loading="lazy"
            />
            <img
              src="/images/user3.jpg"
              alt="Customer 3"
              className="h-9 w-9 rounded-full border-2 border-pageBg object-cover shadow-card"
              loading="lazy"
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
