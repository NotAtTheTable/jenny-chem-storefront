import lbarrow from "../../assets/foundational/light_blue_filled_arrow_right.svg"

interface ArrowButtonProps {
    label: string;
    onClick: () => void;
}

// NOTE: Some Images are inconsistent and have a background so this looks strange

export default function ArrowButton({ label, onClick }: ArrowButtonProps) {
    return (
        <button onClick={onClick} className="bg-jc-dark-blue py-1 px-1  rounded-full border border-jc-light-blue drop-shadow">
            <div className="flex flex-row justify-between">
                <p className="px-4" style={{ color: '#fff' }}>{label}</p>
                <img src={lbarrow} />
            </div>
        </button >
    )
}
