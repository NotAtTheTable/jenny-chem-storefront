export const Chip = ({ handleSelect, isSelected, label }:
    { handleSelect: () => void, isSelected: boolean, label: string }) => {

    let className = `${isSelected ? 'bg-jc-dark-blue text-white' : 'bg-white text-jc-dark-blue'} 
    border-[1px] border-jc-light-blue rounded-full tracking-wide font-bold py-1 px-3`

    return <button className={className} onClick={handleSelect} style={{ boxShadow: "0 0 6px rgba(23,34,93,0.35)" }}>
        {label.toLocaleUpperCase()}
    </button>
}