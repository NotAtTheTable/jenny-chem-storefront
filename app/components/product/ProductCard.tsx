
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
        <div style={{ height: "20.5rem" }} className="flex flex-col items-center justify-between w-48">
            < div className='w-full' >
                <div className="bg-jc-light-grey flex justify-center items-center w-full h-56">
                    <Image
                        sizes="(min-width: 45em) 50vw, 100vw"
                        aspectRatio='1'
                        data={imageData}
                    />
                </div>
                <div className="m-2 line-clamp-2 text-center">{title}</div>
            </div >
            {
                ActionElement && <ActionElement handle={handle} />
            }
        </div >
    )
}
