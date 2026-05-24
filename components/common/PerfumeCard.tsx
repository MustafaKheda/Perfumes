import Image from "next/image";
import ArrowIcon from "./ArrowIcon";

interface PerfumeCardProps {
    image: string;
    name: string;
    notes: string;
    price: string;
}

export default function PerfumeCard({ image, name, notes, price }: PerfumeCardProps) {
    return (
        <div className="bg-[#FFF7DA] rounded-3xl p-4 flex items-center justify-between transition-all group">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 overflow-hidden rounded-2xl">
                    <Image
                        src={image}
                        alt={name}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="text-left">
                    <h3 className="text-[15px] text-textPrimary font-semibold">
                        {name}
                    </h3>
                    <p className="text-sm text-textSecondary">{notes}</p>
                    <p className="text-accent font-semibold mt-1">{price}</p>
                </div>
            </div>

            <div
                className={`ml-auto border border-textPrimary rounded-full p-2 flex items-center justify-center 
                     transition-all duration-300 ease-in-out group-hover:bg-textPrimary`}
            >
                <ArrowIcon
                    className="text-textPrimary transition-colors duration-300 group-hover:text-white"
                    size={18}
                />
            </div>
        </div>
    );
}
