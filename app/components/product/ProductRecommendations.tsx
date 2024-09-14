import { Await, useNavigate } from '@remix-run/react';
import React, { Suspense, useState } from 'react';
import { ProductRecommendationsQuery } from 'storefrontapi.generated';
import ProductCard from '../card/ProductCard';
import { ArrowButton } from '../foundational/ArrowButton';
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

interface ProductRecommendationsProps {
    productRecommendations: ProductRecommendationsQuery["productRecommendations"];
}

function NavigateToProductPageButton({ handle }: { handle: string }) {
    const navigate = useNavigate();
    return <ArrowButton label="VIEW ALL SIZES" onClick={() => navigate(`/products/${handle}`)} />
}

const ProductRecommendations = ({ productRecommendations }: ProductRecommendationsProps) => {
    return (
        <div className='flex flex-row justify-between'>
            {productRecommendations && productRecommendations.slice(0, 5).map((product) => (
                <ProductCard
                    key={product.id}
                    imageData={product.images.nodes[0] as StorefrontAPI.Image}
                    title={product.title}
                    handle={product.handle}
                    price={product.priceRange.minVariantPrice as StorefrontAPI.MoneyV2}
                    ActionElement={NavigateToProductPageButton}
                />
            ))}
        </div>)
};

export default ProductRecommendations;
