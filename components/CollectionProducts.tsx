import ProductCardWide from "./common/ProductCardWide";

interface Product {
    id: string;
    image: string;
    name: string;
    notes: string;
    price: string;
    tag?: string;
    collection: string;
    description: string;
}

export default function CollectionProducts({
    products,
}: {
    products: Product[];
}) {
    if (products.length === 0) {
        return (
            <p className="text-center text-textSecondary py-10">
                No perfumes found in this collection.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-8 md:gap-10  ">
            {products.map((product) => (
                <ProductCardWide
                    key={product.id}
                    productId={product.id}
                    image={product.image}
                    name={product.name}
                    price={product.price}
                    description={product.description}
                    features="Long-lasting, rich & warm, perfect for evening wear."
                    notes={product.notes}
                />
            ))}
        </div>
    );
}
