import Link from "next/link";
import OrderSuccessMessage from "./ui/order-success-message";

export const metadata = {
  title: "Order Placed | Scentora",
};

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f6f1ea] text-textPrimary">
      <section className="mx-auto flex min-h-screen w-full max-w-[760px] items-center justify-center px-4 py-10">
        <div className="w-full rounded-lg border border-black/10 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-textSecondary">
            Order placed
          </p>
          <h1 className="mt-2 font-heading text-4xl font-semibold">Thank you</h1>
          <OrderSuccessMessage />
          <Link
            href="/shop/all"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-black px-5 text-sm font-semibold text-white hover:bg-black/85"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
