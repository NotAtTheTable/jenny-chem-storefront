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
        return <div className="font-bold text-jc-dark-blue text-xl">{title}</div>
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