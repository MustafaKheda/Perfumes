import Image from "next/image";

interface GuideCardProps {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
  reverse?: boolean;
}

export default function GuideCard({
  image,
  title,
  subtitle,
  description,
  points,
  reverse = false,
}: GuideCardProps) {
  return (
    <div
      className={`flex flex-col md:flex-row gap-8 items-center ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Image */}
      <div className="w-full md:w-5/12 aspect-square rounded-3xl overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={700}
          height={500}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="w-full md:flex-1 space-y-4">
        <h3 className="text-sm text-accent font-semibold uppercase">
          {subtitle}
        </h3>
        <h2 className="text-2xl md:text-3xl font-heading">{title}</h2>
        <p className=" leading-relaxed">{description}</p>

        <ul className="list-decimal list-inside space-y-2 marker:text-accent marker:bg-accent/20 marker:rounded-full marker:p-10">
          {points.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
