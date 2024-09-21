import { useState, useRef, useEffect } from "react";
import { ProductFragment, ProductVariantFragment } from "storefrontapi.generated";
import {
    Image,
} from '@shopify/hydrogen';

import "~/styles/app.css"
import { Carousel, CarouselContent, CarouselContentRef, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import useEmblaCarousel from "node_modules/embla-carousel-react/esm/components/useEmblaCarousel";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

export function ProductImages({ selectedVariant, variants, images }: {
    selectedVariant: ProductFragment['selectedVariant'],
    variants: Array<ProductVariantFragment>,
    images: ProductFragment["images"];
}) {

    const getImageIndex = (selectedImage: ProductVariantFragment["image"]) => {
        return images.nodes.findIndex(image => selectedImage?.id == image.id)
    }

    const [largeImageIndex, setLargeImageIndex] = useState(getImageIndex(selectedVariant?.image))
    const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const carouselContentRef = useRef<CarouselContentRef | null>(null);

    // Preload images
    useEffect(() => {
        if (images.nodes) {
            images.nodes.forEach((image) => {
                const img = new window.Image(); // Use window.Image to avoid type issues
                img.src = image.url; // Preload the image
            });
        }
    }, [images])

    useEffect(() => {
        if (!selectedVariant?.image) {
            return
        }

        setLargeImageIndex(getImageIndex(selectedVariant.image))
    }, [selectedVariant])

    useEffect(() => {
        if (thumbnailRefs.current[largeImageIndex]) {
            thumbnailRefs.current[largeImageIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
        // Scroll into view with carousel
        if (carouselContentRef.current) {
            carouselContentRef.current.scrollTo(largeImageIndex)
        }

    }, [largeImageIndex, carouselContentRef]);

    const selectedImage = images.nodes[largeImageIndex];

    if (!selectedImage) {
        return <div className="h-full w-auto"></div>;
    }

    return (
        <div className="md:h-[480px] relative">
            <div className="desktop-component absolute h-[97%] mt-[3%] overflow-y-scroll w-[80px] no-scrollbar" >
                {images.nodes.length > 1 && images.nodes.map((image, index) => (
                    image && (
                        <button
                            ref={el => thumbnailRefs.current[index] = el}
                            onClick={() => setLargeImageIndex(getImageIndex(image))}
                            key={image.id}
                            className={`bg-[#EBF2FF] h-auto w-auto rounded ${largeImageIndex === index ? 'border-2' : 'border'} border-${largeImageIndex === index ? "jc-light-blue" : "jc-light-blue-100"}`}
                        >
                            <Image
                                alt={image.altText || 'Product Image'}
                                aspectRatio="1/1"
                                data={image}
                                width={70}
                                height={70}
                                sizes="70px"
                            />
                        </button>
                    )
                ))}
            </div>
            {
                images.nodes.length > 1 ?
                    <div className="w-auto md:px-10 md:mr-8 md:ml-[80px] relative flex items-center justify-center">
                        <Carousel
                        >
                            <CarouselContent
                                ref={carouselContentRef}
                            >
                                {
                                    images.nodes.map(image => (
                                        <CarouselItem key={image.id} className="pl-0">
                                            <Image
                                                alt={image.altText || 'Product Image'}
                                                aspectRatio="1/1"
                                                data={image}
                                                key={image.id}
                                                sizes="(min-width: 45em) 50vw, 100vw"
                                                className="max-h-full max-w-full object-contain"
                                                loader={({ src }) => `${src}?w=200&h=200&fit=cover`}
                                            />
                                        </CarouselItem>
                                    ))
                                }
                            </CarouselContent>
                            <CarouselNext className="right-[1.5rem]" />
                            <CarouselPrevious className="left-[1.5rem]" />
                        </Carousel>
                    </div>
                    :
                    <div className="w-auto md:px-10 md:mr-8 md:ml-[80px] relative flex items-center justify-center">
                        <div className="h-full w-full flex items-center justify-center">
                            <Image
                                alt={selectedImage.altText || 'Product Image'}
                                aspectRatio="1/1"
                                data={selectedImage}
                                key={selectedImage.id}
                                sizes="(min-width: 45em) 50vw, 100vw"
                                className="max-h-full max-w-full object-contain"
                                loader={({ src }) => `${src}?w=200&h=200&fit=cover`}
                            />
                        </div>
                    </div>
            }
        </div>
    );
}
