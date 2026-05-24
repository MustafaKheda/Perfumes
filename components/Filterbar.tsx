"use client";

import Link from "next/link";
import { Filter, ChevronDown } from "lucide-react";

export function FilterBar({ currentCategory }: { currentCategory: string }) {
  const filters = [
    { label: "All", href: "/shop/all" },
    { label: "Men", href: "/shop/men" },
    { label: "Women", href: "/shop/women" },
    { label: "Unisex", href: "/shop/unisex" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 ">
      <div className="flex items-center gap-3 flex-wrap">
        <button className="flex items-center gap-2 border border-borderRing px-4 py-2 rounded-full hover:bg-cardBg transition">
          <Filter size={16} /> Filters
        </button>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className={`px-3 py-1 text-sm rounded-full border border-borderRing transition ${
                f.href === `/shop/`+currentCategory
                  ? "bg-black text-white"
                  : "hover:bg-cardBg"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

      <button className="flex items-center gap-2 border border-borderRing px-4 py-2 rounded-full hover:bg-cardBg transition">
        Sort By <ChevronDown size={14} />
      </button>
    </div>
  );
}
