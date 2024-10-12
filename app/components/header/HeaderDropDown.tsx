import { CollectionGroupsQuery, HeaderQuery, MenuItemFragment, ParentMenuItemFragment } from "storefrontapi.generated";
import CollectionCard from "../card/CollectionCard";
import { NavLink, useNavigate, useSearchParams } from "@remix-run/react";
import { ArrowButton } from "../foundational/ArrowButton";
import { useRootLoaderData } from "~/lib/root-data";
import { MediaImage } from "@shopify/hydrogen/storefront-api-types";
import { resetSearchParams } from "../Header";

export default function HeaderDropDown({ menu, collectionGroups, primaryDomainUrl }:
    {
        menu: HeaderQuery['menu'],
        collectionGroups: CollectionGroupsQuery,
        primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url']
    }) {

    const [searchParams, setSearchParams] = useSearchParams();
    const navMenuId = searchParams.get('nav-menu-id') || null;
    const collectionGroup = findCollectionGroupByMenuItemId(navMenuId || undefined);
    const menuItem = menu?.items.find(item => item.id === navMenuId) || null;

    function closeDropDown() {
        setSearchParams((prev) => {
            return resetSearchParams(prev);
        })
    }

    function NavigateToCollectionPageButton({ handle }: { handle: string }) {
        const navigate = useNavigate();
        return <ArrowButton label="VIEW COLLECTIONS" onClick={() => navigate(`/collection-groups/${handle}`)} />
    }

    function findCollectionGroupByMenuItemId(menuItemId: string | undefined): { title: string, description: string, handle: string, navbar_pattern: MediaImage } | undefined {
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
        return Object.keys(fieldsObject).length === 0 ? undefined : fieldsObject;
    }

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
                        >
                            {item.title}
                        </NavLink>
                    </div>
                )
            })}
        </div>
    }

    if (!collectionGroup || !menuItem) return null;
    return (
        <>
            <div
                className={`z-[12] w-full absolute bg-white overflow-hidden transition-[max-height] duration-200 ease-in-out shadow-[0_6_9px_rgba(0,0,0,0.16)]`}
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
                            menuItem.items?.map((menuItem) => (
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
            <div onClick={() => closeDropDown()} className="fixed !top-[200px] inset-0 z-[11] opacity-0" />
        </>
    )
}