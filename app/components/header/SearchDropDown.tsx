import { Plus, SearchIcon } from "lucide-react";
import { PredictiveSearchForm, PredictiveSearchResults } from "../Search";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { resetSearchParams } from "../Header";

export default function SearchDropDown() {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    function closeDropDown() {
        setSearchParams((prev) => {
            return resetSearchParams(prev);
        }, { preventScrollReset: true })
    }

    return (
        <>
            <div
                className={`w-full z-[12] absolute bg-white overflow-hidden transition-[max-height] duration-200 ease-in-out shadow-[0_6_9px_rgba(0,0,0,0.16)`}
            >
                <PredictiveSearchForm className="w-full max-w-full">
                    {({ fetchResults, inputRef }) => {
                        return (
                            <div className="w-full p-4 bg-[#EBF2FF] flex justify-center gap-1 relative">
                                <div className="relative w-full max-w-[750px] rounded-tl rounded-bl overflow-hidden">
                                    <input
                                        name="q"
                                        placeholder="Product name, type or sku code"
                                        className="rounded w-full p-2 pr-10 border-[0.75px] border-jc-light-blue focus:outline-none"
                                        ref={inputRef}
                                        type="search"
                                        autoComplete="off"
                                        onChange={fetchResults}
                                        onFocus={fetchResults}
                                    />
                                    <button
                                        className='absolute right-0 top-0 bottom-0 rounded-tr rounded-br px-2 flex items-center bg-jc-light-blue'
                                        onClick={() => {
                                            const searchTerm = inputRef.current?.value;
                                            if (searchTerm) {
                                                navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                                            }
                                        }}
                                    >
                                        <SearchIcon className='text-white w-[25px]' />
                                    </button>
                                </div>
                                <button
                                    className="absolute right-2 top-0 h-full text-jc-dark-blue
                                 rounded-full w-8 flex items-center justify-center"
                                    onClick={() => closeDropDown()}
                                >
                                    <Plus className="rotate-45" strokeWidth={1.5} />
                                </button>
                            </div>
                        )
                    }}
                </PredictiveSearchForm>
                <PredictiveSearchResults />
            </div>
            <div onClick={() => closeDropDown()} className="fixed inset-0 z-[11] opacity-0" />
        </>
    )
}