"use client";

import { useEffect, useState } from "react";

type SiteSettingsResponse = {
  data?: {
    promoBannerText?: string;
  };
};

const fallbackText =
  "Free Shipping on Orders over 30KWD - Arrives Next Day From 5 to 9 PM";

export default function PromoBar() {
  const [text, setText] = useState(fallbackText);

  useEffect(() => {
    let active = true;

    async function loadPromoText() {
      try {
        const response = await fetch("/api/site-settings", { cache: "no-store" });
        const body = (await response.json()) as SiteSettingsResponse;
        const promoText = body.data?.promoBannerText?.trim();

        if (active && promoText) {
          setText(promoText);
        }
      } catch {
        if (active) {
          setText(fallbackText);
        }
      }
    }

    void loadPromoText();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full bg-[#1A1A1A] px-4 py-2 text-center font-body text-xs font-medium text-white sm:text-sm">
      {text}
    </div>
  );
}
