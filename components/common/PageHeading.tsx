
interface HeadingProps {
  text: string;
  count?: number;
  subtitle?: string;
  Filter?: React.ReactNode;
  className?: string;
  bottomBorderNeeded?: boolean;
  fontSize?: string;
  subtitleSize?: string;
}
export function Heading({
  text,
  count,
  subtitle,
  Filter,
  className = "max-w-3xl",
  bottomBorderNeeded = true,
  fontSize = "text-3xl md:text-6xl",
  subtitleSize = "text-sm md:text-base",
}: HeadingProps) {
  return (
    <>
      <div className={`mb-6 flex flex-col gap-1 ${className}`}>
        <div className="flex gap-1 flex-wrap items-end">
          <h1
            className={`${fontSize} uppercase font-heading font-semibold tracking-wide`}
          >
            {text}
          </h1>
          {count && <span className="text-sm mt-2">{count}</span>}
        </div>

        {subtitle && (
          <p className={`font-body font-medium text-textSecondary ${subtitleSize}`}>
            {subtitle}
          </p>
        )}
      </div>

      {Filter && <div className="-mt-6 mb-4">{Filter}</div>}
      {bottomBorderNeeded && <hr className="mb-10" />}
    </>
  );
}
