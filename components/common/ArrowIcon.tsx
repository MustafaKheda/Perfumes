import { ArrowRight } from "lucide-react";

interface ArrowIconProps {
  direction?: "right" | "left" | "up" | "down";
  size?: number;
  className?: string;
}

export default function ArrowIcon({
  direction = "right",
  size = 16,
  className = "",
}: ArrowIconProps) {
  const rotation =
    direction === "left"
      ? "rotate-180"
      : direction === "up"
      ? "-rotate-90"
      : direction === "down"
      ? "rotate-90"
      : "-rotate-45";

  return (
    <ArrowRight
      size={size}
      className={`transition-transform duration-300 ${rotation} ${className}`}
    />
  );
}
