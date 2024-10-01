import { CollectionGroupsQuery, HeaderQuery, MenuItemFragment, ParentMenuItemFragment } from "storefrontapi.generated";
import CollectionCard from "../card/CollectionCard";
import { NavLink, useNavigate } from "@remix-run/react";
import { ArrowButton } from "../foundational/ArrowButton";
import { useRootLoaderData } from "~/lib/root-data";
import { MediaImage } from "@shopify/hydrogen/storefront-api-types";

export default function HeaderDropDown({ menu, selectedIndex = 0, handleSelectedMenuItemIndex, collectionGroups, isHidden = true, primaryDomainUrl }:
    {
        menu: HeaderQuery['menu'],
        selectedIndex: number,
        handleSelectedMenuItemIndex: (index: number | null) => void,
        collectionGroups: CollectionGroupsQuery,
        isHidden: boolean,
        primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url']
    }) {

    function NavigateToCollectionPageButton({ handle }: { handle: string }) {
        const navigate = useNavigate();
        return <ArrowButton label="VIEW COLLECTIONS" onClick={() => navigate(`/collection-groups/${handle}`)} />
    }

    function findCollectionGroupByMenuItemId(menuItemId: string | undefined): { title: string, description: string, handle: string, navbar_pattern: MediaImage } {
        const collectionGroup = collectionGroups.metaobjects.nodes.find(collectionGroup => {
            return collectionGroup.fields.some(field => field.key === "menu_item_id" && field.value === menuItemId)
        })

        // Destructure from the field value format
        const fieldsArray = collectionGroup?.fields || [];
        const fieldsObject = fieldsArray.reduce<Record<string, any>>((acc, field) => {
            acc[field.key] = field.reference || field.value;
            return acc;
        }, {}) as { title: string, description: string, handle: string, navbar_pattern: MediaImage };
        fieldsObject.handle = collectionGroup?.handle || '';
        return fieldsObject
    }

    const collectionGroup = findCollectionGroupByMenuItemId(menu?.items[selectedIndex].id)

    function CollectionList({ menuItem, primaryDomainUrl, keyPass = "" }: {
        menuItem: ParentMenuItemFragment;
        primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
        keyPass?: string;
    }) {
        const { publicStoreDomain } = useRootLoaderData();
        return <div className="flex-1" key={keyPass}>
            <div className="font-bold leading-loose text-jc-dark-blue text-xl border-b border-jc-dark-blue border-opacity-60">{menuItem.title}</div>
            {menuItem.items.map((item, index) => {
                if (!item.url) return <div key={item.id}></div>
                const url =
                    item.url.includes('myshopify.com') ||
                        item.url.includes(publicStoreDomain) ||
                        item.url.includes(primaryDomainUrl)
                        ? new URL(item.url).pathname
                        : item.url;
                return (
                    <div key={item.id} className={"leading-loose text-md text-jc-dark-blue border-b border-jc-dark-blu border-opacity-50"}>
                        <NavLink
                            className={"!no-underline"}
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
            className="w-full absolute bg-white overflow-hidden transition-[max-height] duration-200 ease-in-out shadow-[0_6_9px_rgba(0,0,0,0.16)]"
            style={{
                zIndex: 2,
                maxHeight: isHidden ? '1000px' : '0'
            }}
            onMouseLeave={() => handleSelectedMenuItemIndex(null)}
        >
            <div className="container px-0 py-10 flex flex-row">
                <CollectionCard
                    title={collectionGroup.title}
                    handle={collectionGroup.handle}
                    imageUrl={collectionGroup.navbar_pattern?.image?.url || ""}
                    description={collectionGroup.description}
                    ActionElement={NavigateToCollectionPageButton}
                />
                <div className="flex-1 flex flex-row px-10 py-3 gap-10 justify-between">
                    {
                        menu?.items[selectedIndex]?.items?.map((menuItem) => (
                            <div key={menuItem.id} className="flex-1">
                                <CollectionList
                                    keyPass={menuItem.id}
                                    menuItem={menuItem as ParentMenuItemFragment}
                                    primaryDomainUrl={primaryDomainUrl}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}