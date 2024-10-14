import { SearchIcon } from "lucide-react";
import { PredictiveSearchForm, PredictiveSearchResults } from "../Search";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { resetSearchParams } from "../Header";

export default function MobileSearchDropDown() {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    function closeDropDown() {
        setSearchParams((prev) => {
            return resetSearchParams(prev);
        }, { preventScrollReset: true })
    }

    return (
        <div
            className={``}
        >
            <PredictiveSearchForm className="w-full max-w-full">
                {({ fetchResults, inputRef }) => {
                    return (
                        <div className="w-full p-4 bg-[#EBF2FF] flex justify-center gap-1">
                            <div className="relative w-full max-w-[750px] rounded-tl rounded-bl overflow-hidden">
                                <input
                                    name="q"
                                    placeholder="Product name, type or sku code"
                                    className="rounded w-full md:text-sm p-2 pr-10 border-[0.75px] border-jc-light-blue focus:outline-none"
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
                        </div>
                    )
                }}
            </PredictiveSearchForm>
            <PredictiveSearchResults />
        </div>
    )
}