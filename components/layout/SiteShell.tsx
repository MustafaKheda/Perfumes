"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import PromoBar from "@/components/common/PromoBar";

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoBar />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
