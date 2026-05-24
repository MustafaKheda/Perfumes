"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutView() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signOut() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to sign out");
      }

      window.dispatchEvent(new Event("scentora:cart-updated"));
      window.dispatchEvent(new Event("scentora:auth-updated"));
      router.replace("/login");
      router.refresh();
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Unable to sign out");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-textPrimary">
      <section className="mx-auto grid min-h-screen w-full max-w-[760px] place-items-center px-4 py-10">
        <div className="w-full rounded-lg border border-black/10 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-lg bg-black text-white">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-textSecondary">
            Account
          </p>
          <h1 className="mt-2 font-heading text-4xl font-semibold">Sign out</h1>
          <p className="mx-auto mt-3 max-w-[440px] text-sm leading-6 text-textSecondary">
            End this session on the current device. Your saved cart and orders stay stored
            with your account.
          </p>

          {error ? (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link
              href="/account"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-black/15 px-4 text-sm font-semibold hover:bg-black/5"
            >
              Back to account
            </Link>
            <button
              type="button"
              onClick={signOut}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-black px-4 text-sm font-semibold text-white hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
