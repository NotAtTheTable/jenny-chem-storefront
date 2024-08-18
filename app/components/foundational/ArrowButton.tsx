import lbarrow from "../../assets/foundational/light_blue_filled_arrow_right.svg"
import wbarrow from "../../assets/foundational/white_arrow_right.svg"

import React, { ButtonHTMLAttributes } from 'react';

interface ArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

// NOTE: Some Images are inconsistent and have a background so this looks strange

export const ArrowButton: React.FC<ArrowButtonProps> = ({ label, className, ...props }) => {
    return (
        <button
            className={`${props.disabled ? "opacity-40" : ""} bg-jc-dark-blue border-jc-light-blue py-1 px-1 w-full rounded-full border-2  drop-shadow ${className || ''}`}
            {...props}
        >
            <div className="flex flex-row justify-between">
                <p className="px-2 flex-1 text-center line-clamp-1 text-base" style={{ color: '#fff' }}>{label.toUpperCase()}</p>
                <img alt="arrow" src={lbarrow} />
            </div>
        </button>
    )
}

export const Button: React.FC<ArrowButtonProps> = ({ label, className, ...props }) => {
    return (
        <button
            className={`${props.disabled ? "opacity-40" : ""} bg-jc-dark-blue py-1 px-1 w-full rounded-full border-2 border-jc-light-blue drop-shadow ${className || ''}`}
            {...props}
        >
            <div className="flex flex-row justify-between">
                <p className="px-2 flex-1 text-center line-clamp-1 text-base" style={{ color: '#fff' }}>{label.toUpperCase()}</p>
            </div>
        </button>
    )
}

export const DownArrowButton: React.FC<ArrowButtonProps> = ({ label, className, ...props }) => {
    return (
        <button
            className={`bg-jc-dark-blue py-1 px-1 w-full rounded-full border-2 border-jc-light-blue drop-shadow ${className || ''}`}
            {...props}
        >
            <div className="flex flex-row justify-between">
                <p className="px-2 flex-1 text-center line-clamp-1 text-base" style={{ color: '#fff' }}>{label.toUpperCase()}</p>
                <img style={{ transform: "rotate(90deg)", height: "23px" }} alt="arrow" src={lbarrow} />
            </div>
        </button>
    )
}

export const LightBlueArrowButton: React.FC<ArrowButtonProps> = ({ label, className, ...props }) => {
    return (
        <button
            className={`py-1 px-1 bg-jc-light-blue rounded-full border border-white drop-shadow ${className || ''}`}
            {...props}
        >
            <div className="flex flex-row justify-between">
                <p className="px-2 line-clamp-1 text-base" style={{ color: '#fff' }}>{label.toUpperCase()}</p>
                <img alt="arrow" src={wbarrow} />
            </div>
        </button>
    )
}