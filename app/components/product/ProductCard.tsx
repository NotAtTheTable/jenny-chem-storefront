
import { Image } from '@shopify/hydrogen';
import { Image as ImageType } from '@shopify/hydrogen/storefront-api-types'


interface ProductCardProps {
    imageData: ImageType;
    title: string;
    handle: string;
    ActionElement?: React.FunctionComponent<any>;
}

// NOTE: Some Images are inconsistent and have a background so this looks strange



export default function ProductCard({ imageData, title, handle, ActionElement }: ProductCardProps) {
    return (
        <div style={{ height: "20.5rem" }} className="flex flex-col items-center w-48 border rounded shadow">

            <div className="bg-jc-light-grey flex justify-center items-center w-full h-56">
                <Image
                    sizes="(min-width: 45em) 50vw, 100vw"
                    aspectRatio='1'
                    data={imageData}
                />
            </div>
            <div className='p-2 flex-1 flex flex-col justify-end w-full'>
                <div className="line-clamp-2 text-left text-jc-dark-blue text-base leading-tight">{title}</div>
                <div className="text-xl text-jc-dark-blue py-2">
                    <span>£12.00</span><span className='border-l-2 border-jc-light-blue ml-3'>{/*trust pilot*/}</span>
                </div>
                {
                    ActionElement && <ActionElement handle={handle} />
                }
            </div>

        </div >
    )
}
