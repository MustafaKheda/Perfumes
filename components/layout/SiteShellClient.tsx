"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import PromoBar from "@/components/common/PromoBar";

type SiteSettings = {
  promoBannerText: string;
  facebookUrl: string;
  xUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  contactPhone: string;
  contactEmail: string;
};

export default function SiteShellClient({
  children,
  settings,
}: {
  children: ReactNode;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoBar text={settings.promoBannerText} />
      <Navbar />
      {children}
      <Footer settings={settings} />
    </>
  );
}

