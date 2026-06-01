import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "./ArrowIcon";

interface CollectionCardProps {
  name: string;
  count: string;
  images: string[];
  href: string;
}

export default function CollectionCard({
  name,
  count,
  images,
  href,
}: CollectionCardProps) {
  return (
    <Link
      href={href}
      className="block cursor-pointer group"
      aria-label={`Open ${name}`}
    >
      {/* Images Grid */}
      <div className="grid grid-cols-2 gap-4 mb-5 rounded-3xl overflow-hidden">
        {images.map((src, idx) => (
          <div
            key={idx}
            className="w-full h-60  md:h-40 lg:h-48 overflow-hidden"
          >
            <Image
              src={src}
              alt={`${name} perfume ${idx + 1}`}
              width={600}
              height={400}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              fetchPriority="high"
            />
          </div>
        ))}
      </div>

      {/* Info Row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg">{name}</h3>
          <p className="text-sm text-textSecondary">{count}</p>
        </div>
        <div
          className={`ml-auto border border-textPrimary rounded-full p-2 flex items-center justify-center 
          transition-all duration-300 ease-in-out group-hover:bg-textPrimary`}
        >
          <ArrowIcon
            className="text-textPrimary transition-colors duration-300 group-hover:text-white"
            size={16}
          />
        </div>
      </div>
    </Link>
  );
}
