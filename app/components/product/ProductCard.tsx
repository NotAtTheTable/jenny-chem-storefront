
import { Image } from '@shopify/hydrogen';
import { Image as ImageType } from '@shopify/hydrogen/storefront-api-types'
import TrustProductMini from '../trustpilot/TrustPilotProductWidget';


interface ProductCardProps {
    imageData: ImageType;
    title: string;
    handle: string;
    sku: string;
    ActionElement?: React.FunctionComponent<any>;
}

// NOTE: Some Images are inconsistent and have a background so this looks strange



export default function ProductCard({ imageData, title, handle, ActionElement, sku }: ProductCardProps) {
    return (
        <div style={{ height: "28.5rem", boxShadow: 'rgba(0,0,0,0.1) 0 0 6px' }} className="m-[6px] flex flex-col items-center w-60 border overflow-hidden rounded-lg">
            <div className="bg-jc-light-grey flex justify-center items-center w-full h-72">
                <Image
                    height={"100"}
                    sizes="(min-width: 45em) 50vw, 100vw"
                    aspectRatio='1/1'
                    data={imageData}
                />
            </div>
            <div className='p-2 flex-1 flex flex-col justify-end w-full'>
                <div className="line-clamp-2 text-left text-jc-dark-blue text-base leading-tight">{title}</div>
                <div className="text-xl text-jc-dark-blue py-2">
                    <span>£12.00</span>
                </div>
                <div>
                    <TrustProductMini
                        sku={sku}
                    />
                </div>
                {
                    ActionElement && <ActionElement handle={handle} />
                }
            </div>

        </div >
    )
}
