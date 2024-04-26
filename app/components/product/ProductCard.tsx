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
        <div className="flex flex-col items-center justify-between w-52 h-100 m-4">
            <div className='w-56'>
                <div className="bg-light-grey justify-center items-center w-full h-72">
                    <Image
                        aspectRatio='4/5'
                        data={imageData}
                    />
                </div>
                <div className="m-2 text-center">{title}</div>
            </div>
            <div className="">
                <Link to={`/products/${handle}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    VIEW ALL SIZES
                </Link>
            </div>
        </div>
    )
}
