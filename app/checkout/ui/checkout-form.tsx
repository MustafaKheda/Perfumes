"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, MapPin, Phone } from "lucide-react";

type CheckoutResponse =
  | {
      message: string;
      data: {
        orderId: string;
      };
    }
  | {
      error: string;
    };

export default function CheckoutForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await response.json()) as CheckoutResponse;

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok || "error" in body) {
        throw new Error("error" in body ? body.error : "Unable to place order");
      }

      window.dispatchEvent(new Event("scentora:cart-updated"));
      sessionStorage.setItem("scentora:last-order-id", body.data.orderId);
      router.replace("/order-success");
      router.refresh();
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error ? checkoutError.message : "Unable to place order",
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-textPrimary">
      <section className="mx-auto w-full max-w-[900px] px-4 py-10 lg:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-black text-white">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-textSecondary">
              Shipping details
            </p>
            <h1 className="font-heading text-4xl font-semibold">Checkout</h1>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="First name"
              value={form.firstName}
              onChange={(value) => updateField("firstName", value)}
              required
            />
            <InputField
              label="Last name"
              value={form.lastName}
              onChange={(value) => updateField("lastName", value)}
              required
            />
            <InputField
              label="Phone number"
              value={form.phone}
              onChange={(value) => updateField("phone", value)}
              icon={<Phone className="h-4 w-4 text-textSecondary" aria-hidden="true" />}
              required
            />
            <InputField
              label="Country"
              value={form.country}
              onChange={(value) => updateField("country", value)}
              required
            />
            <div className="md:col-span-2">
              <InputField
                label="Address line 1"
                value={form.addressLine1}
                onChange={(value) => updateField("addressLine1", value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <InputField
                label="Address line 2"
                value={form.addressLine2}
                onChange={(value) => updateField("addressLine2", value)}
              />
            </div>
            <InputField
              label="City"
              value={form.city}
              onChange={(value) => updateField("city", value)}
              required
            />
            <InputField
              label="State"
              value={form.state}
              onChange={(value) => updateField("state", value)}
              required
            />
            <InputField
              label="Postal code"
              value={form.postalCode}
              onChange={(value) => updateField("postalCode", value)}
              required
            />
          </div>

          {error ? (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/cart" className="text-center text-sm font-medium hover:opacity-70">
              Back to cart
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-semibold text-white hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Placing order..." : "Place order"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function InputField({
  icon,
  label,
  onChange,
  required,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <span className="flex items-center rounded-lg border border-black/15 bg-white px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
        {icon}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-11 flex-1 bg-transparent px-3 text-sm outline-none"
          required={required}
        />
      </span>
    </label>
  );
}
