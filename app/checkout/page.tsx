import type { Metadata } from "next";
import CheckoutForm from "./ui/checkout-form";

export const metadata: Metadata = {
  title: "Checkout | Scentora",
  description: "Enter your shipping address and place your Scentora order.",
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
