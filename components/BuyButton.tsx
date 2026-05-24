import CommonLink from "./common/CommonLink";

export default function BuyButton({ price }: { price: string }) {
    return (
        <div className="flex items-center justify-between mt-4 gap-3">
            <CommonLink inverse href="/shop" className="flex-1">
                Buy Now
            </CommonLink>

            <span className="text-textPrimary font-medium border px-3 py-2 rounded-pill">${price}</span>
        </div>
    );
}
