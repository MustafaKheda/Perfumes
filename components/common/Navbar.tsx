"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  role: "USER";
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCart() {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });

        if (response.status === 401) {
          if (active) {
            setCartQuantity(0);
          }
          return;
        }

        const body = (await response.json()) as {
          meta?: { totalQuantity?: number };
        };

        if (active) {
          setCartQuantity(body.meta?.totalQuantity ?? 0);
        }
      } catch {
        if (active) {
          setCartQuantity(0);
        }
      }
    }

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const body = (await response.json()) as { data: CurrentUser | null };

        if (active) {
          setUser(body.data);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      }
    }

    function loadSessionState() {
      void loadUser();
      void loadCart();
    }

    loadSessionState();

    window.addEventListener("scentora:cart-updated", loadCart);
    window.addEventListener("scentora:auth-updated", loadSessionState);

    return () => {
      active = false;
      window.removeEventListener("scentora:cart-updated", loadCart);
      window.removeEventListener("scentora:auth-updated", loadSessionState);
    };
  }, []);

  const accountLabel = user?.name || user?.email || "Sign in";

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1300px] items-center justify-between p-4 font-body text-[#1A1A1A]">
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-9 w-9 place-items-center rounded-md md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <nav className="hidden items-center gap-6 text-[14px] font-medium md:flex">
            <Link href="/" className="hover:opacity-70" prefetch>
              Home
            </Link>
            <Link href="/shop/all" className="hover:opacity-70" prefetch>
              Shop
            </Link>
            <Link href="/collections/all" className="hover:opacity-70" prefetch>
              Collection
            </Link>
            <Link href="/guide" className="hover:opacity-70" prefetch>
              Guide
            </Link>
            <Link href="/about" className="hover:opacity-70" prefetch>
              About
            </Link>
          </nav>
        </div>

        <Link
          href="/"
          className="font-heading text-xl font-semibold uppercase tracking-widest"
        >
          SCENTORA
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/cart" aria-label="Cart" className="relative">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-black/50 hover:bg-black/5">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            </span>
            {cartQuantity > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-[#F9A826] px-1.5 text-[10px] font-semibold leading-none text-black">
                {cartQuantity}
              </span>
            ) : null}
          </Link>

          <div className="group relative">
            <Link
              href={user ? "/account" : "/login"}
              aria-label={accountLabel}
              className="grid h-9 w-9 place-items-center rounded-full border border-black/50 hover:bg-black/5"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div className="pointer-events-none absolute right-0 top-11 z-20 min-w-[180px] rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-[#1A1A1A] opacity-0 shadow-sm transition group-hover:opacity-100">
              <span className="block truncate">{accountLabel}</span>
            </div>
          </div>

          {user ? (
            <Link
              href="/logout"
              className="hidden min-h-9 items-center justify-center gap-2 rounded-full border border-black/50 px-3 text-sm font-medium hover:bg-black/5 sm:inline-flex"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </Link>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-black/10 md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3 text-[14px] font-medium text-[#1A1A1A]">
              {[
                ["Home", "/"],
                ["Shop", "/shop/all"],
                ["Collection", "/collections/all"],
                ["Guide", "/guide"],
                ["About", "/about"],
                [accountLabel, user ? "/account" : "/login"],
                ["Cart", "/cart"],
                ...(user ? [["Logout", "/logout"]] : []),
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-2 hover:bg-black/5"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
