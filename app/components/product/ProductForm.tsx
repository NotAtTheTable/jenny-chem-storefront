import { ShopPayButton, VariantSelector } from "@shopify/hydrogen";
import { useState } from "react";
import { ProductFragment, ProductVariantFragment } from "storefrontapi.generated";
import { ProductOptionButtons } from "./ProductOptionButtons";
import { ProductPrice } from "./ProductPrice";
import { Button } from "../foundational/ArrowButton";
import { AddToCartButton } from "./ProductAddToCartButton";

import "~/styles/app.css"
import { ProductOptionSelect } from "./ProductOptionSelect";
import NumericInput from "../foundational/NumericInput";
import { useRootLoaderData } from "~/lib/root-data";

export function ProductForm({
    product,
    selectedVariant,
    variants,
}: {
    product: ProductFragment;
    selectedVariant: ProductFragment['selectedVariant'];
    variants: Array<ProductVariantFragment>;
}) {
    const { publicStoreDomain } = useRootLoaderData();

    // Store the quantity of products in the form
    const [quantity, setQuantity] = useState<number>(1);
    // Remove the product.options which have name "title" so we don't get default
    const filteredOptions = product.options.filter(option => option.name.toLowerCase() !== 'title');

    const openCartAside = () => {
        const url = new URL(window.location.href);
        if (!url.hash.includes('cart-aside')) {
            url.hash = 'cart-aside';
            window.location.href = url.toString();
        }
    }

    return (
        <>
            <div className="desktop-component">
                <VariantSelector
                    handle={product.handle}
                    options={filteredOptions}
                    variants={variants}
                >
                    {({ option }) => <ProductOptionButtons key={option.name} option={option} />}
                </VariantSelector>
                <div className='flex items-center'>
                    <label style={{ display: 'block', transform: 'translateY(1.5px)' }} className='font-display tracking-wide text-2xl text-jc-dark-blue mr-4'>Quantity:</label>
                    <NumericInput min={1} value={quantity} onChange={(value) => { setQuantity(value) }} />
                </div>
                <div className='flex flex-row items-center mt-4'>
                    <div className='flex items-center'>
                        <ProductPrice
                            selectedVariant={selectedVariant}
                        />
                    </div>
                    <div className='w-[1px] mx-6 self-stretch bg-jc-light-blue' />
                    <p>KLARNA</p>
                </div>
                <div className='mt-6 w-56'>
                    {
                        !selectedVariant?.availableForSale ?
                            <div>
                                <Button
                                    disabled={true}
                                    label='Sold Out'
                                />
                            </div>

                            :
                            <AddToCartButton
                                disabled={!selectedVariant}
                                onClick={openCartAside}
                                lines={
                                    selectedVariant
                                        ? [
                                            {
                                                selectedVariant: selectedVariant,
                                                merchandiseId: selectedVariant.id,
                                                quantity: quantity,
                                            },
                                        ]
                                        : []
                                }
                                label={'Add to basket'}
                            />
                    }
                </div>
            </div>
            <div className="mobile-component">
                <VariantSelector
                    handle={product.handle}
                    options={filteredOptions}
                    variants={variants}
                >
                    {({ option }) =>
                        option.name === "Size" ?
                            <ProductOptionButtons key={option.name} option={option} />
                            : <ProductOptionSelect key={option.name} option={option} />
                    }
                </VariantSelector>

                <div className='flex flex-row items-center my-7'>
                    <div className='flex items-center'>
                        <NumericInput min={1} value={quantity} onChange={(value) => { setQuantity(value) }} />
                    </div>
                    <div className='w-[1px] mx-6 self-stretch bg-jc-light-blue' />
                    <div className='flex items-center'>
                        <ProductPrice
                            selectedVariant={selectedVariant}
                        />
                    </div>
                </div>
                <div>
                    {
                        !selectedVariant?.availableForSale ?
                            <div>
                                <Button
                                    disabled={true}
                                    label='Sold Out'
                                />
                            </div>

                            :
                            <>
                                <AddToCartButton
                                    disabled={!selectedVariant}
                                    onClick={openCartAside}
                                    lines={
                                        selectedVariant
                                            ? [
                                                {
                                                    selectedVariant: selectedVariant,
                                                    merchandiseId: selectedVariant.id,
                                                    quantity: quantity,
                                                },
                                            ]
                                            : []
                                    }
                                    label={'Add to basket'}
                                />
                                <ShopPayButton
                                    variantIdsAndQuantities={[{ id: selectedVariant.id, quantity }]}
                                    storeDomain={publicStoreDomain}
                                    width="100%"
                                    className="rounded-lg overflow-hidden mt-2 shadow"
                                />
                            </>
                    }
                </div>
            </div>
        </>
    );
}
