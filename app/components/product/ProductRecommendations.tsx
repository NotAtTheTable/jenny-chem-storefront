import { Await, useNavigate } from '@remix-run/react';
import React, { Suspense, useState } from 'react';
import { ProductRecommendationsQuery } from 'storefrontapi.generated';
import ProductCard from '../card/ProductCard';
import { ArrowButton } from '../foundational/ArrowButton';
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

import "~/styles/app.css"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

interface ProductRecommendationsProps {
    productRecommendations: ProductRecommendationsQuery["productRecommendations"];
}

function NavigateToProductPageButton({ handle }: { handle: string }) {
    const navigate = useNavigate();
    return <ArrowButton label="VIEW ALL SIZES" onClick={() => navigate(`/products/${handle}`)} />
}

const ProductRecommendations = ({ productRecommendations }: ProductRecommendationsProps) => {
    return (
        <>
            <Carousel opts={{
                loop: true,
                skipSnaps: true
            }}
                className="desktop-component mt-3 px-6"
            >
                <CarouselContent>
                    {productRecommendations && productRecommendations.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/5 pl-0 flex justify-center">
                            <ProductCard
                                key={product.id}
                                imageData={product.images.nodes[0] as StorefrontAPI.Image}
                                title={product.title}
                                handle={product.handle}
                                price={product.priceRange.minVariantPrice as StorefrontAPI.MoneyV2}
                                ActionElement={NavigateToProductPageButton}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext skip={2} style={{ top: "40%", right: "-1.5rem" }} />
                <CarouselPrevious skip={2} style={{ top: "40%", left: "-1.5rem" }} />
            </Carousel>
            <Carousel opts={{
                loop: true
            }}
                className="mobile-component mt-3 mx-6"
            >
                <CarouselContent>
                    {productRecommendations && productRecommendations.map((product) => (
                        <CarouselItem key={product.id} className="w-min pl-0 flex justify-center">
                            <ProductCard
                                key={product.id}
                                imageData={product.images.nodes[0] as StorefrontAPI.Image}
                                title={product.title}
                                handle={product.handle}
                                price={product.priceRange.minVariantPrice as StorefrontAPI.MoneyV2}
                                ActionElement={NavigateToProductPageButton}
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext style={{ top: "40%", right: "-2.5rem" }} />
                <CarouselPrevious style={{ top: "40%", left: "-2.5rem" }} />
            </Carousel>
        </>
    )
};

export default ProductRecommendations;
