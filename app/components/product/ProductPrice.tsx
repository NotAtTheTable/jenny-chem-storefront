import { Money } from "@shopify/hydrogen";
import { ProductFragment } from "storefrontapi.generated";

export function ProductPrice({
    selectedVariant,
}: {
    selectedVariant: ProductFragment['selectedVariant'];
}) {
    return (
        <div>
            {
                selectedVariant?.price && <Money style={{ letterSpacing: "0.12rem" }} className={`font-display text-${selectedVariant.compareAtPrice ? 'jc-green' : 'jc-dark-blue'} text-5xl -mb-1`} data={selectedVariant?.price} />
            }
        </div>
    );
}
