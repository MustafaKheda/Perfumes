"use client";

const fallbackText =
  "Free Shipping on Orders over 30KWD - Arrives Next Day From 5 to 9 PM";

export default function PromoBar({ text }: { text?: string }) {
  const value = text?.trim() ? text.trim() : fallbackText;

  return (
    <div className="w-full bg-[#1A1A1A] px-4 py-2 text-center font-body text-xs font-medium text-white sm:text-sm">
      {value}
    </div>
  );
}
