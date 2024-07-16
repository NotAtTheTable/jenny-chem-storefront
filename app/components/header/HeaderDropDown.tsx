import { HeaderQuery } from "storefrontapi.generated";
import CollectionCard from "../card/CollectionCard";
import { useNavigate } from "@remix-run/react";
import { ArrowButton } from "../foundational/ArrowButton";

export default function HeaderDropDown({ menu, selectedIndex = 0 }: { menu: HeaderQuery['menu'], selectedIndex: number }) {

    function NavigateToCollectionPageButton({ handle }: { handle: string }) {
        const navigate = useNavigate();
        return <ArrowButton label="VIEW COLLECTIONS" onClick={() => navigate(`/products/${handle}`)} />
    }

    function CollectionList({ title }: { title: string }) {
        const arr = [1, 2, 3, 4, 5, 6, 7, 8,]
        return <div className="flex-1">
            <div className="font-bold leading-loose text-jc-dark-blue text-xl border-b-2 border-jc-dark-blue border-opacity-60">{title}</div>
            {arr.map((val) => (
                <div className="leading-loose text-lg text-jc-dark-blue border-b border-[#c7c7c7]">Collection {val}</div>
            ))}
        </div>
    }

    return <div className="w-full absolute bg-white" style={{ zIndex: 1 }}>
        <div className="container px-0 py-10 flex flex-row">
            <CollectionCard title={menu?.items[selectedIndex].title || ""} handle={"some random  garbage"} ActionElement={NavigateToCollectionPageButton}
            />
            <div className="flex-1 flex flex-row px-10 py-3 p gap-10">
                {
                    menu?.items[selectedIndex].items.map(({ title }) => (
                        <CollectionList
                            title={title}
                        />
                    ))
                }
            </div>
        </div>
    </div>
}