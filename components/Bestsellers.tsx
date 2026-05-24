import ProductCard from "./ProductCard";

export default function BestSellers() {
  return (
    <section aria-labelledby="best-sellers">
      <h2
        id="best-sellers"
        className="font-body font-medium text-[1rem] text-textPrimary mb-4"
      >
        Best Selling Product
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 max-w-[550px]">
        <ProductCard
          img="/images/Perfume/30.webp"
          title="Premium Men Scent"
          price="$50.00"
        />
        <ProductCard
          img="/images/Perfume/34.webp"
          title="Premium Men Scent"
          price="$50.00"
        />
      </div>
    </section>
  );
}
