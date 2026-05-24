import type { Metadata } from "next";
import LogoutView from "./ui/logout-view";

export const metadata: Metadata = {
  title: "Sign Out | Scentora",
  description: "Sign out of your Scentora account.",
};

export default function LogoutPage() {
  return <LogoutView />;
}
