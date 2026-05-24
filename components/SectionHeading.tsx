import React from "react";

interface SectionHeadingProps {
    title?: string; // e.g., "INDULGE IN EXQUISITE"
    highlight?: string; // e.g., "FRAGRANCES"
    subtitle?: string; // optional
    align?: "center" | "left" | "right"; // optional alignment
    className?: string; // for custom margin or spacing
    headingElement?: React.ReactNode; // for custom heading element
}

export default function SectionHeading({
    title,
    highlight,
    subtitle,
    align = "center",
    className = "",
    headingElement,
}: SectionHeadingProps) {
    const alignment =
        align === "left"
            ? "text-left"
            : align === "right"
                ? "text-right"
                : "text-center";

    return (
        <div className={`${alignment} space-y-2 mb-10 ${className}`}>
            {headingElement ? headingElement : <h2 className="text-3xl md:text-4xl font-heading tracking-tight text-textPrimary">
                {title} <span className="text-accent">{highlight}</span>
            </h2>}
            {subtitle && (
                <p className="text-textSecondary text-sm mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
}


// export default function SectionHeading() {
//   return (
//     <div className="text-center space-y-2 mb-10">
//       <h2 className="text-3xl md:text-4xl font-heading tracking-tight text-textPrimary">
//         INDULGE IN EXQUISITE <span className="text-accent">FRAGRANCES</span>
//       </h2>
//       <p className="text-textSecondary text-sm  mx-auto">
//         Discover our signature scents crafted with elegance, sophistication, and timeless allure.
//       </p>
//     </div>
//   );
// }
