"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination() {
  const pages = [1, 2, 3, 4];

  return (
    <div className="flex items-center justify-center gap-3">
      <button className="border border-borderRing rounded-full p-2 hover:bg-cardBg">
        <ChevronLeft size={16} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`w-9 h-9 flex items-center justify-center rounded-full border ${
            page === 1 ? "bg-black text-white" : "border-borderRing"
          }`}
        >
          {page}
        </button>
      ))}

      <button className="border border-borderRing rounded-full p-2 hover:bg-cardBg">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
