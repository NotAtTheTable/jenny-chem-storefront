import { VariantSelector } from "@shopify/hydrogen";
import { useState } from "react";
import { ProductFragment, ProductVariantFragment } from "storefrontapi.generated";
import { ProductOptions } from "./ProductOptions";
import { QuantityInput } from "./ProductQuantityInput";
import { ProductPrice } from "./ProductPrice";
import { Button } from "../foundational/ArrowButton";
import { AddToCartButton } from "./ProductAddToCartButton";

export function ProductForm({
    product,
    selectedVariant,
    variants,
}: {
    product: ProductFragment;
    selectedVariant: ProductFragment['selectedVariant'];
    variants: Array<ProductVariantFragment>;
}) {

    // Store the quantity of products in the form
    const [quantity, setQuantity] = useState<number>(1);

    // Remove the product.options which have name "title" so we don't get default
    const filteredOptions = product.options.filter(option => option.name.toLowerCase() !== 'title');

    return (
        <div>
            <VariantSelector
                handle={product.handle}
                options={filteredOptions}
                variants={variants}
            >
                {({ option }) => <ProductOptions key={option.name} option={option} />}
            </VariantSelector>
            <QuantityInput
                value={`${quantity}`}
                onChange={(value) => { setQuantity(Number(value)) }}
            />
            <div className='flex flex-row items-center'>
                <div className='flex items-center'>
                    <ProductPrice
                        selectedVariant={selectedVariant}
                    />
                </div>
                <div className='w-[1px] mx-6 self-stretch bg-jc-light-blue' />
                <p>KLARNA</p>
            </div>
            <div className='my-6 w-56'>
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
                            onClick={() => {
                                window.location.href = window.location.href + '#cart-aside';
                            }}
                            lines={
                                selectedVariant
                                    ? [
                                        {
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
    );
}
