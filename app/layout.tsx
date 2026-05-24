import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import type { ReactNode } from "react";
import SiteShell from "@/components/layout/SiteShell";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scentora | Timeless Scents, Lasting Impressions",
  description:
    "Discover elegant, long-lasting fragrances crafted for individuality. Premium scents, trusted by 25k+ users.",
  openGraph: {
    title: "Scentora | Timeless Scents, Lasting Impressions",
    description:
      "Discover elegant, long-lasting fragrances crafted for individuality. Premium scents, trusted by 25k+ users.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="text-textPrimary">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
