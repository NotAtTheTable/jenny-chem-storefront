import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

export interface SelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
    disabled = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (option: Option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div
            ref={selectRef}
            className={`relative ${className}`}
        >
            <button
                type="button"
                onClick={handleToggle}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby="select-label"
                disabled={disabled}
                className={`w-full px-3 py-1 flex flex-row items-center text-center text-white border-[1.5px] border-jc-light-blue bg-jc-dark-blue rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-jc-light-blue focus:border-jc-light-blue ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    }`}
            >
                <span style={{ transform: 'translateY(1px)' }} className="block truncate w-full text-xl">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className='absolute right-0 top-1/2 transform -translate-y-1/2 pr-3'>
                    <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-white"></div>
                </span>
            </button>

            {isOpen && (
                <ul
                    className="absolute z-10 w-full py-1 mt-1 overflow-auto text-xl bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-xl"
                    tabIndex={-1}
                    role="listbox"
                    aria-labelledby="select-label"
                    aria-activedescendant={selectedOption ? selectedOption.value : undefined}
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`cursor-default select-none relative py-2 pl-3 pr-3 mb-0 ${option.value === value
                                ? 'text-white bg-jc-dark-blue'
                                : 'text-gray-900 hover:bg-blue-100'
                                }`}
                            id={option.value}
                            role="option"
                            aria-selected={option.value === value}
                            onClick={() => handleSelect(option)}
                        >
                            <span className={`block truncate ${option.value === value ? 'font-semibold' : 'font-normal'}`}>
                                {option.label}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Select;
