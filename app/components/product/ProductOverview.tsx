import { Image as HydrogenImage, Video as HydrogenVideo } from '@shopify/hydrogen';
import { Image, MediaImage, Video } from '@shopify/hydrogen/storefront-api-types';
import React from 'react';
import { ProductFragment } from 'storefrontapi.generated';
import { Carousel, CarouselBreadcrumbs, CarouselContent, CarouselItem } from '../ui/carousel';
import Autoplay from 'embla-carousel-autoplay'

interface ProductOverviewProps {
    overviewMedia?: ProductFragment["overviewMedia"];
    descriptionHtml?: string;
}

const HydrogenMedia = ({ media, className }: { media: MediaImage | Video | undefined, className?: string }) => {
    switch (media?.__typename) {
        case "MediaImage":
            return <HydrogenImage className={className} sizes="(max-width: 600px) 100vw, (min-width: 601px) 50vw" data={(media as MediaImage).image || undefined} alt={(media as MediaImage).image?.altText || 'Product image'} />
        // case "Video":
        //     return <HydrogenVideo className={`${className} bg-black`} data={(media as Video) || undefined} />
        default:
            return null;
    }
}

const MediaCarousel = ({ mediaList }: { mediaList: ProductFragment["overviewMedia"] }) => {
    if (!mediaList?.references?.nodes) {
        return null;
    }
    return (
        <Carousel
            opts={{
                loop: true,
                duration: 35
            }}
            plugins={[
                //@ts-ignore
                Autoplay({
                    delay: 7000,
                }),
            ]}

        >
            <CarouselContent >
                {mediaList?.references?.nodes.map((media) => (
                    <CarouselItem key={(media as MediaImage).id} className='pl-0 overflow-hidden' >
                        <HydrogenMedia media={media as (MediaImage | Video | undefined)} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            {mediaList?.references?.nodes.length > 1 && <CarouselBreadcrumbs />}
        </Carousel>
    )
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({ overviewMedia, descriptionHtml }) => {

    const overviewMediaPresent = overviewMedia?.references?.nodes && overviewMedia?.references?.nodes.length > 0

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {overviewMediaPresent && (
                <div className="h-full w-full md:w-3/5 rounded-lg overflow-hidden shadow-[0_0_5px_rgba(0,0,0,0.3)]">
                    <MediaCarousel
                        mediaList={overviewMedia}
                    />
                </div>
            )}
            {descriptionHtml && (
                <div className={overviewMediaPresent ? 'md:w-2/5' : 'w-full'}>
                    <div className='productOverview' dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                </div>
            )}
        </div>
    );
};

