import type { Metadata } from "next";
import CartView from "./ui/cart-view";

export const metadata: Metadata = {
  title: "Cart | Scentora",
  description: "Review and update your Scentora cart.",
};

export default function CartPage() {
  return <CartView />;
}
