import { useEffect } from "react";
import { ProductFragment } from "storefrontapi.generated";

export function ProductFAQs({ product }: { product: ProductFragment; }) {
    useEffect(() => {
        (window as any).simesyProductFaqData = {
            moneyFormat: "${{amount}}",
            moneyFormatWithCurrency: "${{amount}} USD",
            product: product,
            productCollections: product.collections.nodes.map((collection: any) => collection.id),
            tags: product.tags,
        };
    }, [product]);
    return (
        <div className="simesy-product-faq"></div>
    )
}
