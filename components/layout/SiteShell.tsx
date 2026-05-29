import type { ReactNode } from "react";
import { getSiteSettings } from "@/lib/site-settings";
import SiteShellClient from "@/components/layout/SiteShellClient";

export default async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return <SiteShellClient settings={settings}>{children}</SiteShellClient>;
}
