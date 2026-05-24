"use client";
import { useState } from "react";
import CommonLink from "./common/CommonLink";

const filters = ["All", "Hot Now", "Popular", "Men's", "Women's", "Luxury and Premium"];

export default function FilterTabs() {
    const [active, setActive] = useState("Hot Now");
    return (
        <div className="flex flex-wrap gap-3 mb-10">
            {filters.map((f) => (
                <button
                    key={f}
                    onClick={() => setActive(f)}
                    className={`px-5 py-2 rounded-full border border-borderRing text-sm font-medium transition-all ${active === f
                        ? "bg-black text-white"
                        : "bg-transparent text-textPrimary hover:bg-black hover:text-white"
                        }`}
                >
                    {f}
                </button>
            ))}
            <CommonLink inverse className="ml-auto">
                Shop Now
            </CommonLink>

        </div>
    );
}
