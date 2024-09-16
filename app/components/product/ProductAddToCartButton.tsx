import { FetcherWithComponents } from "@remix-run/react";
import { CartForm } from "@shopify/hydrogen";
import { CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { ArrowButton, MobileArrowButton } from "../foundational/ArrowButton";

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
        <>
            <div className="desktop-only">
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
            <div className="mobile-only">
                <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
                    {(fetcher: FetcherWithComponents<any>) => (
                        <>
                            <input
                                name="analytics"
                                type="hidden"
                                value={JSON.stringify(analytics)}
                            />
                            <MobileArrowButton
                                className="w-full py-2"
                                type="submit"
                                onClick={onClick}
                                disabled={disabled ?? fetcher.state !== 'idle'}
                                label={label}
                            />
                        </>
                    )}
                </CartForm>
            </div>
        </>
    )

}
