import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ProductFragment, ProductVariantFragment } from "storefrontapi.generated";
import {
    Image,
} from '@shopify/hydrogen';

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
    }, [largeImageIndex]);

    const handleNavigationClick = (indexChange: number) => {
        const newIndex = (largeImageIndex + indexChange + images.nodes.length) % images.nodes.length;
        setLargeImageIndex(newIndex);
    }

    const selectedImage = images.nodes[largeImageIndex];

    if (!selectedImage) {
        return <div className="h-full w-auto"></div>;
    }
    return (
        <div className="h-[480px] relative">
            <div className="absolute h-full overflow-y-scroll w-[80px] no-scrollbar" >
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
            <div className="w-auto px-10 mr-8 ml-[80px] relative flex items-center justify-center">
                {images.nodes.length > 1 && <>
                    <button onClick={() => handleNavigationClick(-1)} className='absolute left-[40px] top-1/2 transform -translate-y-1/2'>
                        <CircleChevronLeft className={'text-jc-light-blue'} size={40} strokeWidth={1} />
                    </button>
                    <button onClick={() => handleNavigationClick(1)} className='absolute right-[40px] top-1/2 transform -translate-y-1/2'>
                        <CircleChevronRight className={'text-jc-light-blue'} size={40} strokeWidth={1} />
                    </button>
                </>
                }
                <div className="h-full w-full flex items-center justify-center">
                    <Image
                        alt={selectedImage.altText || 'Product Image'}
                        aspectRatio="1/1"
                        data={selectedImage}
                        key={selectedImage.id}
                        sizes="(min-width: 45em) 50vw, 100vw"
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
