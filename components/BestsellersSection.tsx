import CommonLink from "./common/CommonLink";
import PerfumeCard from "./common/PerfumeCard";
import SectionHeading from "./SectionHeading";

const perfumes = [
    { image: "/images/Perfume/1.webp", name: "Premium Men Scent", notes: "Oud, Bergamot, Amber", price: "$50.00" },
    { image: "/images/Perfume/2.webp", name: "Premium Men Scent", notes: "Oud, Bergamot, Amber", price: "$50.00" },
    { image: "/images/Perfume/3.webp", name: "Premium Men Scent", notes: "Oud, Bergamot, Amber", price: "$50.00" },
    { image: "/images/Perfume/18.webp", name: "Premium Men Scent", notes: "Oud, Bergamot, Amber", price: "$50.00" },
    { image: "/images/Perfume/15.webp", name: "Premium Men Scent", notes: "Oud, Bergamot, Amber", price: "$50.00" },
    { image: "/images/Perfume/9.webp", name: "Premium Men Scent", notes: "Oud, Bergamot, Amber", price: "$50.00" },

];

export default function BestSellersSection() {
    return (
        <section className="text-center">

            <SectionHeading
                headingElement={<h2 className="text-[28px] font-heading font-semibold text-textPrimary">
                    <span className="text-accent">BEST SELLERS</span> & <span className="text-accent">TRENDING</span> PERFUMES
                </h2>}
                subtitle="Discover the most-loved fragrances, handpicked by our customers."
            />


            <div className="mt-10 flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {perfumes.map((p, i) => (
                    <PerfumeCard key={i} {...p} />
                ))}
            </div>

            <CommonLink href="/shop/all" inverse className="mt-5" >
                View All
            </CommonLink>
        </section>
    );
}
