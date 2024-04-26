import { Link } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import { Image as ImageType } from '@shopify/hydrogen/storefront-api-types'
import ArrowButton from '../foundational/ArrowButton';
import { ReactNode } from 'react';

interface ProductCardProps {
    imageData: ImageType;
    title: string;
    handle: string;
    ActionElement?: React.FunctionComponent<any>;
}

// NOTE: Some Images are inconsistent and have a background so this looks strange



export default function ProductCard({ imageData, title, handle, ActionElement }: ProductCardProps) {
    return (
        <div className="flex flex-col items-center justify-between w-52 h-100 m-4">
            <div className='w-56'>
                <div className="bg-light-grey flex justify-center items-center w-full h-72">
                    <Image
                        sizes='sizes="(min-width: 45em) 50vw, 100vw"'
                        aspectRatio='1'
                        data={imageData}
                    />
                </div>
                <div className="m-2 text-center">{title}</div>
            </div>
            {
                ActionElement && <ActionElement handle={handle} />
            }
        </div >
    )
}
