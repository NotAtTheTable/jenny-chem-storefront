import { HeaderQuery, MenuItemFragment, ParentMenuItemFragment } from "storefrontapi.generated";
import CollectionCard from "../card/CollectionCard";
import { NavLink, useNavigate } from "@remix-run/react";
import { ArrowButton } from "../foundational/ArrowButton";
import { useRootLoaderData } from "~/lib/root-data";

export default function HeaderDropDown({ menu, selectedIndex = 0, handleSelectedMenuItemIndex, isHidden = true, primaryDomainUrl }:
    {
        menu: HeaderQuery['menu'],
        selectedIndex: number,
        handleSelectedMenuItemIndex: (index: number | null) => void,
        isHidden: boolean,
        primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url']
    }) {

    function NavigateToCollectionPageButton({ handle }: { handle: string }) {
        const navigate = useNavigate();
        return <ArrowButton label="VIEW COLLECTIONS" onClick={() => navigate(`/products/${handle}`)} />
    }

    function CollectionList({ menuItem, primaryDomainUrl, key = "" }: {
        menuItem: ParentMenuItemFragment;
        primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
        key?: string;
    }) {
        const { publicStoreDomain } = useRootLoaderData();
        return <div className="flex-1" key={key}>
            <div className="font-bold leading-loose text-jc-dark-blue text-xl border-b border-jc-dark-blue border-opacity-60">{menuItem.title}</div>
            {menuItem.items.map((item) => {
                if (!item.url) return null;
                const url =
                    item.url.includes('myshopify.com') ||
                        item.url.includes(publicStoreDomain) ||
                        item.url.includes(primaryDomainUrl)
                        ? new URL(item.url).pathname
                        : item.url;
                return (
                    <div className={"leading-loose text-md text-jc-dark-blue border-b border-jc-dark-blu border-opacity-50"}>
                        <NavLink
                            end
                            key={item.id}
                            prefetch="intent"
                            to={url}
                            onClick={() => handleSelectedMenuItemIndex(null)}
                        >
                            {item.title}
                        </NavLink>
                    </div>
                )
            })}
        </div>
    }

    return (
        <div
            className="w-full absolute bg-white overflow-hidden transition-[max-height] duration-200 ease-in-out"
            style={{
                zIndex: 2,
                maxHeight: isHidden ? '1000px' : '0'
            }}
            onMouseLeave={() => handleSelectedMenuItemIndex(null)}
        >
            <div className="container px-0 py-10 flex flex-row">
                <CollectionCard title={menu?.items[selectedIndex].title || ""} handle={"some random  garbage"} ActionElement={NavigateToCollectionPageButton}
                />
                <div className="flex-1 flex flex-row px-10 py-3 p gap-10">
                    {
                        menu?.items[selectedIndex]?.items?.map((menuItem) => (
                            <CollectionList
                                key={menuItem.id}
                                menuItem={menuItem as ParentMenuItemFragment}
                                primaryDomainUrl={primaryDomainUrl}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}