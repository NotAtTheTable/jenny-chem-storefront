import React from "react"

interface DashDividerProps {
    light?: boolean;
}

const DashDivider: React.FC<DashDividerProps> = ({ light = false }) => {

    let className = `w-16 h-1 bg-${light ? "white" : "jc-light-blue"}`

    return (
        <div className="w-full my-4 flex items-center justify-center">
            <div className={className} />
        </div>
    )
}

export default DashDivider;