import React from "react"
import { cn } from "~/lib/utils";

interface DashDividerProps {
    light?: boolean;
    className?: string;
}

const DashDivider: React.FC<DashDividerProps> = ({ light = false, className }) => {
    return (
        <div className="w-full my-3 flex items-center justify-center">
            <div className={cn([`w-16 h-[3px] bg-${light ? "white" : "jc-light-blue"}`, className])} />
        </div>
    )
}

export default DashDivider;