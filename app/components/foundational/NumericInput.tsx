import React from 'react';

interface NumericInputProps {
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
}

const NumericInput: React.FC<NumericInputProps> = ({ min = 0, max = 100, step = 1, value, onChange }) => {

    const handleDecrement = () => {
        if (value > min) {
            onChange(value - step);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + step);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    return (
        <div className="flex items-center space-x-1 text-xl md:text-lg">
            <button
                onClick={handleDecrement}
                className="px-2 md:px-4 text-xl md:text-lg border-[1.5px] border-jc-light-blue text-jc-dark-blue rounded transition"
            >
                -
            </button>
            <input
                type="number"
                className="text-xl w-16 md:text-lg appearance-none text-center bg-[unset] text-jc-dark-blue border-[1.5px] border-jc-light-blue rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={handleInputChange}
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
            />
            <button
                onClick={handleIncrement}
                className="text-xl px-2 md:px-4 border-[1.5px] border-jc-light-blue text-jc-dark-blue rounded transition"
            >
                +
            </button>
        </div>
    );
};

export default NumericInput;