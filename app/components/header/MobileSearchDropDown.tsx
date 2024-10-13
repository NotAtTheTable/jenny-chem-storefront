import { SearchIcon } from "lucide-react";
import { PredictiveSearchForm, PredictiveSearchResults } from "../Search";
import { useSearchParams } from "@remix-run/react";
import { resetSearchParams } from "../Header";

export default function MobileSearchDropDown() {

    const [searchParams, setSearchParams] = useSearchParams();

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
                        <div className="w-full py-4 bg-[#EBF2FF] flex justify-center">
                            <div className="relative w-full mx-4 max-w-[750px] rounded-tl rounded-bl overflow-hidden">
                                <input
                                    name="q"
                                    onChange={fetchResults}
                                    onFocus={fetchResults}
                                    placeholder="Product name, type or sku code"
                                    className="rounded w-full pl-12 text-sm pr-1 py-2 border-[0.75px] border-jc-light-blue focus:outline-none"
                                    ref={inputRef}
                                    type="search"
                                />
                                <div className="absolute inset-y-0 left-0 px-2 flex items-center pointer-events-none bg-jc-light-blue">
                                    <SearchIcon className='text-white w-[20px]' />
                                </div>
                            </div>
                        </div>
                    )
                }}
            </PredictiveSearchForm>
            <PredictiveSearchResults />
        </div>
    )
}