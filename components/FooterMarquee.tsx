export default function FooterMarquee() {
  return (
    <footer
      className="w-full bg-textPrimary text-pageBg text-[0.9rem] font-heading font-medium tracking-wide uppercase"
      aria-label="Store highlights"
    >
      <div className="w-full overflow-hidden whitespace-nowrap border-t border-black">
        <div className="flex items-center gap-4 sm:gap-8 py-4 px-4 animate-[marquee_25s_linear_infinite]">
          <FooterItem text="24/7 Support" />
          <FooterItem text="Best Return Policy" />
          <FooterItem text="Long-Lasting Fragrance" />
          <FooterItem text="Finest Notes" />
          <FooterItem text="24/7 Support" />
          <FooterItem text="Best Return Policy" />
          <FooterItem text="Long-Lasting Fragrance" />
          <FooterItem text="Finest Notes" />
        </div>
      </div>

      {/* marquee keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}

function FooterItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <span>{text}</span>
      <span className="text-accent">★</span>
    </div>
  );
}
