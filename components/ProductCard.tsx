import Image from "next/image";

type Props = {
  img: string;
  title: string;
  price: string;
};

export default function ProductCard({ img, title, price }: Props) {
  return (
    <article className="flex items-start gap-4 p-4 rounded-2xl bg-cardBg shadow-card border border-black/5 hover:shadow-xl hover:-translate-y-0.5 transition-all">
      <div className=" w-[72px] rounded-md bg-white flex items-center justify-center shadow-card overflow-hidden">
        <Image
          src={img}
          alt={title}
          width={72}
          height={72}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex flex-col">
        <h3 className="font-body text-[1rem] text-textPrimary font-semibold leading-tight">
          {title}
        </h3>
        <p className="text-accent font-body text-[1rem] font-medium mt-2">
          {price}
        </p>
      </div>
    </article>
  );
}
