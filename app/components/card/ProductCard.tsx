
import { useNavigate } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import { Image as ImageType } from '@shopify/hydrogen/storefront-api-types'
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import { ArrowButton } from '../foundational/ArrowButton';

interface ProductCardProps {
    id: string;
    imageData: ImageType;
    title: string;
    handle: string;
    price?: StorefrontAPI.MoneyV2;
    ActionElement?: React.FunctionComponent<any>;
}

export default function ProductCard({ id, imageData, title, handle, price, ActionElement }: ProductCardProps) {
    return (
        <div key={id} style={{ height: "28.5rem" }} className="shadow m-[6px] flex flex-col w-60 border overflow-hidden rounded-lg">
            <div className="bg-jc-light-grey flex justify-center items-center w-full h-70">
                <Image
                    height={"100"}
                    sizes="(min-width: 45em) 50vw, 100vw"
                    aspectRatio='1/1'
                    data={imageData}
                />
            </div>
            <div className='p-4 flex-1 flex flex-col justify-between text-center w-full bg-white'>
                <div className="line-clamp-2 text-jc-dark-blue font-semibold text-xl leading-tight">{title}</div>
                <div className="flex flex-col items-center justify-end">
                    <div className='w-10 border-t-2 border-jc-light-blue mt-2' />
                    <span className='text-2xl text-jc-dark-blue py-2'>
                        {price && <Money data={price} />}
                    </span>
                    {
                        ActionElement && <ActionElement handle={handle} />
                    }
                </div>
            </div>

        </div >
    )
}

export function MiniProductCard({ id, imageData, title, handle, price, ActionElement }: ProductCardProps) {
    return (
        <div key={id} className="shadow m-[6px] flex flex-col h-[22.5rem] border overflow-hidden rounded-lg">
            <div className="bg-jc-light-grey flex justify-center items-center w-full h-[12.5rem]">
                <Image
                    height={"100"}
                    sizes="(min-width: 45em) 50vw, 100vw"
                    aspectRatio='1/1'
                    data={imageData}
                />
            </div>
            <div className='p-4 flex-1 flex flex-col justify-between text-center w-full bg-white'>
                <div className="line-clamp-2 text-jc-dark-blue font-semibold text-sm leading-tight">{title}</div>
                <div className="flex flex-col items-center justify-end">
                    <div className='w-10 border-t-2 border-jc-light-blue mt-2' />
                    <span className='text-2xl text-jc-dark-blue py-2'>
                        {price && <Money data={price} />}
                    </span>
                    {
                        ActionElement && <ActionElement handle={handle} />
                    }
                </div>
            </div>

        </div >
    )
}
