"use client";

interface BreadcrumbItem {
  label: string;
  href?: string; // optional — last item doesn’t need href
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <p className="text-sm text-textSecondary mb-3">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;

        return (
          <span key={i}>
            {!isLast && item.href ? (
              <>
                <a
                  href={item.href}
                  className="hover:underline text-textPrimary capitalize"
                >
                  {item.label}
                </a>{" "}
                &gt;{" "}
              </>
            ) : (
              <span className="text-textPrimary capitalize">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </p>
  );
}
