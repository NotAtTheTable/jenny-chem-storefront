import { Minus, Plus } from 'lucide-react';
import React from 'react';

interface NumericInputProps {
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    inputReadOnly?: boolean;
}

const NumericInput: React.FC<NumericInputProps> = ({ min = 0, max = 100, step = 1, value, onChange, inputReadOnly = false }) => {

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
                className="h-6 border-[1.5px] border-jc-light-blue text-jc-dark-blue rounded transition"
            >
                <Minus strokeWidth={4} height={15} />
            </button>
            <input
                readOnly={inputReadOnly}
                type="number"
                className="text-xl h-6 w-10 md:text-lg appearance-none text-center bg-[unset] text-jc-dark-blue border-[1.5px] border-jc-light-blue rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={handleInputChange}
                style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
            />
            <button
                onClick={handleIncrement}
                className="h-6 border-[1.5px] border-jc-light-blue text-jc-dark-blue rounded transition"
            >
                <Plus strokeWidth={4} height={15} />
            </button>
        </div>
    );
};

export default NumericInput;