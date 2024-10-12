import { SearchIcon } from "lucide-react";
import { PredictiveSearchForm, PredictiveSearchResults } from "../Search";
import { useSearchParams } from "@remix-run/react";

export default function SearchDropDown() {
    return (
        <div
            className={`w-full absolute bg-white overflow-hidden transition-[max-height] duration-200 ease-in-out shadow-[0_6_9px_rgba(0,0,0,0.16)`}
        >
            <PredictiveSearchForm className="w-full max-w-full">
                {({ fetchResults, inputRef }) => {
                    return (
                        <div className="w-full py-4 bg-[#EBF2FF] flex justify-center">
                            <div className="relative w-full max-w-[750px] rounded-tl rounded-bl overflow-hidden">
                                <input
                                    name="q"
                                    onChange={fetchResults}
                                    placeholder="Product name, type or sku code"
                                    className="rounded w-full pl-12 text-sm pr-1 py-1 border-[0.75px] border-jc-light-blue focus:outline-none"
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