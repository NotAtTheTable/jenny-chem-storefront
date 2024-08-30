import Select, { SelectProps } from "../foundational/Select";

export function QuantityInput({ value, onChange }: { value: SelectProps['value'], onChange: SelectProps['onChange'] }) {
    return (
        <div className='flex items-center my-6'>
            <label className='font-display tracking-wide text-2xl text-jc-dark-blue mr-4'>Quantity:</label>
            <Select
                className='w-14 text-jc-dark-blue text-xl font-display leading-none'
                options={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                    { value: '5', label: '5' },
                    { value: '6', label: '6' },
                    { value: '7', label: '7' },
                    { value: '8', label: '8' },
                    { value: '9', label: '9' },
                    { value: '10', label: '10' }
                ]}
                value={value} onChange={onChange} />
        </div>
    )
}