import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { Image as ImageType } from '@shopify/hydrogen/storefront-api-types'

interface ProductCardProps {
    imageData: ImageType;
    title: string;
    handle: string;
}

// NOTE: Some Images are inconsistent and have a background so this looks strange

export default function ProductCard({ imageData, title, handle }: ProductCardProps) {
    return (
        <div className="flex flex-col items-center max-w-xs min-w-max sm:min-w-60">
            <div className="bg-light-grey flex-grow">

                <Image
                    data={imageData}
                />

            </div>
            {title}
            <Link to={`/products/${handle}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                VIEW ALL SIZES
            </Link>
        </div>
    )
}
