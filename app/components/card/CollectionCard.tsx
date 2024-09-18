import DashDivider from "../foundational/DashDivider";
import Heading from "../foundational/Heading";

interface CollectionCardProps {
    title: string;
    handle: string;
    ActionElement?: React.FunctionComponent<any>;
}

// NOTE: Some Images are inconsistent and have a background so this looks strange



export default function CollectionCard({ title, handle, ActionElement }: CollectionCardProps) {
    return (
        <div style={{ boxShadow: 'rgba(0,0,0,0.1) 0 0 6px' }} className="px-6 py-5 bg-jc-dark-blue-100 flex flex-col justify-between w-96 h-96 border overflow-hidden rounded-3xl">
            <div>
                <Heading dashClassName="w-16" className="line-clamp-2 text-white tracking-wide font-display text-[90px] leading-[85px]" level={1}>{title}</Heading>
                <div className="text-base text-white leading-tight">{handle}</div>
            </div>
            <div className="w-52">
                {
                    ActionElement && <ActionElement handle={handle} />
                }
            </div>
        </div>
    )
}