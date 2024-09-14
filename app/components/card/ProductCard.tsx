
import { Image, Money } from '@shopify/hydrogen';
import { Image as ImageType } from '@shopify/hydrogen/storefront-api-types'
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

interface ProductCardProps {
    imageData: ImageType;
    title: string;
    handle: string;
    price: StorefrontAPI.MoneyV2;
    ActionElement?: React.FunctionComponent<any>;
}

export default function ProductCard({ imageData, title, handle, price, ActionElement }: ProductCardProps) {
    return (
        <div style={{ height: "28.5rem", boxShadow: 'rgba(0,0,0,0.1) 0 0 6px' }} className="m-[6px] flex flex-col w-60 border overflow-hidden rounded-lg">
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
                    <span className='text-2xl text-jc-dark-blue py-2'><Money data={price} />
                    </span>
                    {
                        ActionElement && <ActionElement handle={handle} />
                    }
                </div>
            </div>

        </div >
    )
}
