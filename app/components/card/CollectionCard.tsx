import DashDivider from "../foundational/DashDivider";

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
                <div style={{ lineHeight: "1em", letterSpacing: "0.2rem" }} className="line-clamp-2 text-white font-display text-[90px] leading-tight">{title}</div>
                <div className="w-14 -mt-2"><DashDivider /></div>
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