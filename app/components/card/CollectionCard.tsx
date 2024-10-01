import DashDivider from "../foundational/DashDivider";
import Heading from "../foundational/Heading";

interface CollectionCardProps {
    title: string;
    imageUrl: string;
    handle: string;
    description: string;
    ActionElement?: React.FunctionComponent<any>;
}

// NOTE: Some Images are inconsistent and have a background so this looks strange



export default function CollectionCard({ title, imageUrl, handle, description, ActionElement }: CollectionCardProps) {
    return (
        <div className="shadow-md px-6 py-5 flex flex-col justify-between w-96 h-96 border overflow-hidden rounded-3xl" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div>
                <Heading dashClassName="w-16" className="line-clamp-2 !text-white tracking-wide font-display text-[90px] leading-[85px]" level={1}>{title}</Heading>
                <div className="text-base text-white leading-tight">{description}</div>
            </div>
            <div className="w-52">
                {
                    ActionElement && <ActionElement handle={handle} />
                }
            </div>
        </div>
    )
}