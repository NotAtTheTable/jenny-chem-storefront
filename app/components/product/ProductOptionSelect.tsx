import { VariantOption } from "@shopify/hydrogen";
import Select from "../foundational/Select";
import { useNavigate } from "@remix-run/react";

export function ProductOptionSelect({ option }: { option: VariantOption }) {

    const navigate = useNavigate();

    const onChange = (to: string) => {
        navigate(to)
    }

    return (
        <div className='flex items-center'>
            <Select
                className='w-full mt-3 text-jc-dark-blue text-xl font-display leading-none'
                options={option.values.map((val) => ({
                    label: val.value,
                    value: val.to
                }))}
                value={option.values.find(val => val.isActive)?.to || `Select ${option.name}`} onChange={onChange} />
        </div>
    )
}