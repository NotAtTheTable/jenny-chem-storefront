import React from 'react';
import { HeaderQuery } from 'storefrontapi.generated';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ProductShipping } from '../product/ProductShipping';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

import BlueRightArrow from '~/assets/foundational/arrows/carousel_blue_arrow_right.svg'
import { ChevronRightIcon, CircleChevronRightIcon } from 'lucide-react';
import { useRootLoaderData } from '~/lib/root-data';
import { NavLink } from '@remix-run/react';

interface MobileMenuProps {
    menu: HeaderQuery['menu'],
    primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url']
}

const MobileMenu: React.FC<MobileMenuProps> = ({ menu, primaryDomainUrl }) => {

    const { publicStoreDomain } = useRootLoaderData();
    // TODO : Only use the collectionGroups, for the others just have links
    return (
        <Tabs defaultValue={menu?.items[0].id} className='py-4'>
            <TabsList className="flex w-full overflow-x-scroll no-scrollbar divide-x md:divide-x-0 divide-jc-light-blue">
                {
                    menu?.items.map((item) => (
                        <TabsTrigger value={item.id} className="md:min-w-[200px] flex-shrink-0 px-5 md:px-10">{item.title}</TabsTrigger>
                    ))
                }
            </TabsList>
            {
                menu?.items.map((navItem) => (
                    <TabsContent className='px-5' value={navItem.id}>
                        {
                            <Accordion collapsible type="single">

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
                                                        className='flex items-center w-full justify-between pb-2 text-xsm border-b-[0.75px] border-[#C7C7C] text-jc-dark-blue font-body'
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
                        }
                    </TabsContent>
                ))
            }
        </Tabs>
    );
};

export default MobileMenu;
