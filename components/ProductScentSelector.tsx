"use client";

import { useState } from "react";

type ProductScentSelectorProps = {
  options: string[];
};

export default function ProductScentSelector({ options }: ProductScentSelectorProps) {
  const [selected, setSelected] = useState(options[0] ?? "");

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSecondary">
            Choose smell
          </p>
          <p className="mt-1 text-sm font-medium text-textPrimary">
            Selected: {selected}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const active = selected === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelected(option)}
              aria-pressed={active}
              className={`min-h-12 rounded-lg border px-4 text-sm font-semibold transition ${
                active
                  ? "border-textPrimary bg-textPrimary text-white shadow-sm"
                  : "border-black/15 bg-white text-textPrimary hover:border-textPrimary"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
