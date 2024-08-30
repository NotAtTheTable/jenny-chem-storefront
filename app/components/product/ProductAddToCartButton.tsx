import { FetcherWithComponents } from "@remix-run/react";
import { CartForm } from "@shopify/hydrogen";
import { CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { ArrowButton } from "../foundational/ArrowButton";

export function AddToCartButton({
    analytics,
    disabled,
    lines,
    onClick,
    label,
}: {
    analytics?: unknown;
    disabled?: boolean;
    lines: CartLineInput[];
    onClick?: () => void;
    label: string;
}) {
    return (
        <div>
            <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
                {(fetcher: FetcherWithComponents<any>) => (
                    <>
                        <input
                            name="analytics"
                            type="hidden"
                            value={JSON.stringify(analytics)}
                        />
                        <ArrowButton
                            type="submit"
                            onClick={onClick}
                            disabled={disabled ?? fetcher.state !== 'idle'}
                            label={label}
                        />
                    </>
                )}
            </CartForm>
        </div>
    )
}
