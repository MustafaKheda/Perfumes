"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Mail, User, UserRoundPlus } from "lucide-react";

type SignupResponse =
  | {
      message: string;
      data: {
        id: string;
        email: string;
        name: string | null;
        role: "USER";
        verificationRequired: boolean;
        devOtp?: string;
      };
    }
  | {
      error: string;
    };

type VerifyResponse =
  | {
      message: string;
    }
  | {
      error: string;
    };

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      const body = (await response.json()) as SignupResponse;

      if (!response.ok || "error" in body) {
        throw new Error("error" in body ? body.error : "Unable to create account");
      }

      setPendingEmail(email.trim().toLowerCase());
      setDevOtp("data" in body && body.data.devOtp ? body.data.devOtp : null);
      setVerificationStep(true);
    } catch (signupError) {
      setError(
        signupError instanceof Error ? signupError.message : "Unable to create account",
      );
    } finally {
      setLoading(false);
    }
  }

  async function onVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail,
          code: otp,
        }),
      });
      const body = (await response.json()) as VerifyResponse;

      if (!response.ok || "error" in body) {
        throw new Error("error" in body ? body.error : "Unable to verify account");
      }

      router.replace("/shop/all");
      router.refresh();
    } catch (verifyError) {
      setError(
        verifyError instanceof Error ? verifyError.message : "Unable to verify account",
      );
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      });
      const body = (await response.json()) as
        | { message: string; data?: { devOtp?: string } }
        | { error: string };

      if (!response.ok || "error" in body) {
        throw new Error("error" in body ? body.error : "Unable to resend code");
      }

      setDevOtp("data" in body && body.data?.devOtp ? body.data.devOtp : null);
    } catch (resendError) {
      setError(resendError instanceof Error ? resendError.message : "Unable to resend code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f1ea] text-textPrimary">
      <section className="mx-auto grid min-h-screen w-full max-w-[1300px] items-center gap-10 px-4 py-10 lg:grid-cols-[0.9fr_1fr] lg:px-6">
        <div className="mx-auto w-full max-w-[460px] rounded-lg border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-black text-white">
              <UserRoundPlus className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-textSecondary">
              Scentora account
            </p>
            <h1 className="mt-2 font-heading text-4xl font-semibold">Sign up</h1>
          </div>

          {verificationStep ? (
            <form onSubmit={onVerify} className="space-y-5">
              <div>
                <label htmlFor="signup-otp" className="mb-2 block text-sm font-medium">
                  Verification code
                </label>
                <input
                  id="signup-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-black/15 bg-white px-3 text-center text-lg tracking-[0.4em] outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                  maxLength={6}
                  required
                />
                <p className="mt-2 text-sm text-textSecondary">
                  Enter the 6-digit code sent to {pendingEmail}.
                </p>
                {devOtp ? (
                  <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                    Dev OTP: {devOtp}
                  </p>
                ) : null}
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
                {loading ? "Verifying..." : "Verify account"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={resendOtp}
                className="min-h-11 w-full rounded-lg border border-black/15 px-4 text-sm font-semibold transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Resend code
              </button>
            </form>
          ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="signup-name" className="mb-2 block text-sm font-medium">
                Full name
              </label>
              <div className="flex items-center rounded-lg border border-black/15 bg-white px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
                <User className="h-4 w-4 text-textSecondary" aria-hidden="true" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-h-11 flex-1 bg-transparent px-3 text-sm outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <div className="flex items-center rounded-lg border border-black/15 bg-white px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
                <Mail className="h-4 w-4 text-textSecondary" aria-hidden="true" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="flex items-center rounded-lg border border-black/15 bg-white px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
                <LockKeyhole className="h-4 w-4 text-textSecondary" aria-hidden="true" />
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-11 flex-1 bg-transparent px-3 text-sm outline-none"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-textSecondary">At least 8 characters</p>
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="mb-2 block text-sm font-medium">
                Confirm password
              </label>
              <div className="flex items-center rounded-lg border border-black/15 bg-white px-3 focus-within:border-black focus-within:ring-2 focus-within:ring-black/10">
                <LockKeyhole className="h-4 w-4 text-textSecondary" aria-hidden="true" />
                <input
                  id="signup-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
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
              {loading ? "Creating account..." : "Create account"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
          )}

          <div className="mt-6 border-t border-black/10 pt-6">
            <p className="text-center text-sm text-textSecondary">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-textPrimary hover:opacity-70">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden overflow-hidden rounded-lg border border-black/10 bg-white lg:block">
          <Image
            src="/images/perfume-bottle.webp"
            alt="Scentora fragrance bottle"
            width={900}
            height={980}
            className="h-[760px] w-full object-cover"
            priority
          />
        </div>
      </section>
    </main>
  );
}
