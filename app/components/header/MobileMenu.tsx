import React from 'react';
import { CollectionGroupsQuery, HeaderQuery } from 'storefrontapi.generated';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

import { ChevronRightIcon, CircleChevronRightIcon } from 'lucide-react';
import { useRootLoaderData } from '~/lib/root-data';
import { NavLink, useNavigate } from '@remix-run/react';
import Heading from '../foundational/Heading';
import { ArrowButton } from '../foundational/ArrowButton';
import {
    Image,
} from '@shopify/hydrogen';
import { MediaImage } from '@shopify/hydrogen/storefront-api-types';

interface MobileMenuProps {
    menu: HeaderQuery['menu'],
    primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'],
    collectionGroups: CollectionGroupsQuery,
}

const LINK_ITEMS = [
    'gid://shopify/MenuItem/475474723008',
    'gid://shopify/MenuItem/475474755776',
    'gid://shopify/MenuItem/475474788544'
]

const MobileMenu: React.FC<MobileMenuProps> = ({ menu, primaryDomainUrl, collectionGroups }) => {

    const { publicStoreDomain } = useRootLoaderData();
    const navigate = useNavigate();

    const collectionGroupsMap = collectionGroups.metaobjects.nodes.reduce((acc, group) => {
        const menuItemIdField = group.fields.find(field => field.key === "menu_item_id");
        if (menuItemIdField?.value) {
            acc[menuItemIdField.value] = {
                title: group.fields.find(field => field.key === "title")?.value || '',
                description: group.fields.find(field => field.key === "description")?.value || '',
                handle: group.handle,
                featuredProduct: group.fields.find(field => field.key === "featured_product")?.reference,
                featuredProductTitle: group.fields.find(field => field.key === "featured_product_title")?.value || undefined,
                featuredProductImage: (group.fields.find(field => field.key === "featured_product_image")?.reference as MediaImage) || undefined,
                navbarImage: (group.fields.find(field => field.key === "navbar_pattern")?.reference as MediaImage) || undefined,
            };
        }
        return acc;
    }, {} as Record<string,
        {
            title: string;
            description: string;
            handle: string;
            featuredProduct: any;
            featuredProductTitle?: string;
            featuredProductImage?: MediaImage;
            navbarImage?: MediaImage;
        }>);


    const navigateToProductPage = (handle: string) => {
        return navigate(`/products/${handle}`)
    }

    return (
        <Tabs defaultValue={menu?.items[0].id} className='py-1'>
            <TabsList className="flex w-full overflow-x-scroll no-scrollbar divide-x md:divide-x-0 divide-jc-light-blue">
                {
                    menu?.items.map((item) => {
                        if (LINK_ITEMS.includes(item.id) && item.url) {
                            const url =
                                item.url.includes('myshopify.com') ||
                                    item.url.includes(publicStoreDomain) ||
                                    item.url.includes(primaryDomainUrl)
                                    ? new URL(item.url).pathname
                                    : item.url;
                            return (
                                <NavLink key={item.id} to={url} className="!no-underline inline-flex items-center justify-center text-jc-dark-blue whitespace-nowrap rounded-sm px-3 py-1 text-xl flex-shrink-0 px-5 md:px-10 text-jc-dark-blue font-display">
                                    {item.title}
                                </NavLink>
                            );
                        }
                        return (<TabsTrigger key={item.id} value={item.id} className="md:min-w-[200px] flex-shrink-0 px-5 md:px-10">{item.title}</TabsTrigger>)
                    })
                }
            </TabsList>
            {
                menu?.items.map((navItem) => (
                    navItem.items.length > 0 &&
                    <TabsContent className='!mt-1' key={navItem.id} value={navItem.id}>
                        <div className='flex flex-row p-5 bg-jc-dark-blue' style={{ backgroundImage: `url(${collectionGroupsMap[navItem.id].navbarImage?.image?.url})`, backgroundSize: 'cover' }}>
                            <div className='w-1/2'>
                                <Heading dashClassName='w-16' className='!text-white text-6xl line-clamp-2' level={3}>
                                    {collectionGroupsMap[navItem.id].featuredProductTitle || collectionGroupsMap[navItem.id].featuredProduct?.title || collectionGroupsMap[navItem.id].title}
                                </Heading>
                                <ArrowButton onClick={() => navigateToProductPage(collectionGroupsMap[navItem.id].featuredProduct.handle)} className='w-max mx-auto' label='VIEW PRODUCT' />
                            </div>
                            <div className='w-1/2'>
                                <Image
                                    alt={(collectionGroupsMap[navItem.id].featuredProductImage || collectionGroupsMap[navItem.id].featuredProduct.images.nodes[0]).altText || 'Product Image'}
                                    aspectRatio="1/1"
                                    data={collectionGroupsMap[navItem.id].featuredProductImage || collectionGroupsMap[navItem.id].featuredProduct.images.nodes[0]}
                                    key={(collectionGroupsMap[navItem.id].featuredProductImage || collectionGroupsMap[navItem.id].featuredProduct.images.nodes[0]).id}
                                    sizes="(min-width: 45em) 50vw, 100vw"
                                    className="max-h-full max-w-full object-contain"
                                    loader={({ src }) => `${src}?w=200&h=200&fit=cover`}
                                />
                            </div>
                        </div>
                        <Accordion className='px-5 py-2' collapsible type="single" defaultValue={navItem.items[0].id}>

                            {navItem.items.map((collectionGroupItem) => (
                                <AccordionItem key={collectionGroupItem.id} value={collectionGroupItem.id}>
                                    <AccordionTrigger hideDefaultToggle customDataStateClass='[&[data-state=open]>div>svg]:rotate-90'>
                                        <div key={collectionGroupItem.id} className='flex items-center w-full justify-between pb-2 flex-row border-b border-jc-dark-blue'>
                                            <h3 className='text-jc-dark-blue font-body text-xl'>{collectionGroupItem.title}</h3>
                                            <CircleChevronRightIcon className='text-jc-light-blue' />
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='flex flex-col gap-2 '>
                                        {collectionGroupItem.items.map((collectionItem) => {
                                            if (!collectionItem.url) return <div key={collectionItem.id}></div>
                                            const url =
                                                collectionItem.url.includes('myshopify.com') ||
                                                    collectionItem.url.includes(publicStoreDomain) ||
                                                    collectionItem.url.includes(primaryDomainUrl)
                                                    ? new URL(collectionItem.url).pathname
                                                    : collectionItem.url;
                                            return (
                                                <NavLink
                                                    end
                                                    key={collectionItem.id}
                                                    prefetch="intent"
                                                    to={url}
                                                    className='!no-underline flex items-center w-full justify-between pb-2 text-xsm border-b-[0.75px] border-[#C7C7C] text-jc-dark-blue font-body'
                                                >
                                                    {collectionItem.title}
                                                    <ChevronRightIcon height={18} strokeWidth={2.5} className='text-jc-light-blue' />
                                                </NavLink>
                                            )
                                        })}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TabsContent>
                )
                )
            }
        </Tabs>
    );
};

export default MobileMenu;
