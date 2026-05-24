"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";

type LoginResponse =
  | {
      message: string;
      data: {
        id: string;
        email: string;
        name: string | null;
        role: "USER";
      };
    }
  | {
      error: string;
    };

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json()) as LoginResponse;

      if (!response.ok || "error" in body) {
        throw new Error("error" in body ? body.error : "Unable to sign in");
      }

      router.replace("/shop/all");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-textPrimary">
      <section className="mx-auto grid min-h-screen w-full max-w-[1300px] items-center gap-10 px-4 py-10 lg:grid-cols-[1fr_0.9fr] lg:px-6">
        <div className="hidden overflow-hidden rounded-lg border border-black/10 bg-white lg:block">
          <Image
            src="/images/hero.webp"
            alt="Premium Scentora perfume bottle"
            width={900}
            height={980}
            className="h-[680px] w-full object-cover"
            priority
          />
        </div>

        <div className="mx-auto w-full max-w-[460px] rounded-lg border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-black text-white">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-textSecondary">
              Welcome back
            </p>
            <h1 className="mt-2 font-heading text-4xl font-semibold">Sign in</h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="user-email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <div className="flex items-center rounded-lg border border-black/15 bg-white px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
                <Mail className="h-4 w-4 text-textSecondary" aria-hidden="true" />
                <input
                  id="user-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="min-h-11 flex-1 bg-transparent px-3 text-sm outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="user-password" className="block text-sm font-medium">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm font-medium hover:opacity-70">
                  Forgot?
                </Link>
              </div>
              <div className="flex items-center rounded-lg border border-black/15 bg-white px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
                <LockKeyhole className="h-4 w-4 text-textSecondary" aria-hidden="true" />
                <input
                  id="user-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-11 flex-1 bg-transparent px-3 text-sm outline-none"
                  required
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-6 border-t border-black/10 pt-6">
            <p className="text-center text-sm text-textSecondary">
              New to Scentora?{" "}
              <Link href="/signup" className="font-medium text-textPrimary hover:opacity-70">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
