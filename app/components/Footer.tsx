import { NavLink } from '@remix-run/react';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { useRootLoaderData } from '~/lib/root-data';
import FacebookIcon from '~/assets/social-icons/footer-facebook-white.svg'
import YoutubeIcon from '~/assets/social-icons/youtube-white.svg'
import TiktokIcon from '~/assets/social-icons/tiktok-white.svg'
import InstagramIcon from '~/assets/social-icons/instagram-white.svg'
import { LightBlueArrowButton } from './foundational/ArrowButton';
import { Viewport } from '~/routes/_index';

import { CircleChevronRight } from "lucide-react"
import { useViewport } from '~/hooks/useViewport';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BlueBubbleBackground } from './foundational/BlueBubbleBackground';

export function Footer({
  menu,
  siteMapMenu,
  shop,
}: { menu: FooterQuery['menu'], shop: HeaderQuery['shop'], siteMapMenu: FooterQuery['menu']; }) {

  const isMobile = useViewport();
  if (isMobile !== null) {
    return (

      <footer>
        <MailingListBanner viewport={isMobile ? 'mobile' : 'desktop'} />
        <BlueBubbleBackground>
          {menu && shop?.primaryDomain?.url && (
            <FooterMenu viewport={isMobile ? 'mobile' : 'desktop'} menu={menu} siteMapMenu={siteMapMenu} primaryDomainUrl={shop.primaryDomain.url} />
          )}
        </BlueBubbleBackground>
      </footer>
    );
  } else {
    return <></>
  }

}

function MailingListBanner({ viewport = 'desktop' }: { viewport?: Viewport }) {
  if (viewport === 'mobile') {
    return <div className='bg-jc-light-blue'>
      <div className="flex flex-col items-center py-3 container">
        <h3 style={{ lineHeight: 'inherit' }} className='text-white font-display text-xl'>Join Our Mailing List For Updates & Offers:</h3>
        <div className='flex flex-row-reverse gap-2 w-full'>
          <LightBlueArrowButton onClick={() => { }} label='Sign Up' />
          <input
            className='rounded-full px-4 flex-1'
            placeholder='Enter your email address'
          />
        </div>
      </div>
    </div>
  } else {
    return <div className='bg-jc-light-blue'>
      <div className="flex justify-between items-center py-3 px-12 container">
        <div>
          <div className="flex flex-row gap-1">
            <a href="https://www.facebook.com/Officialjennychem/"><img alt="Facebook" src={FacebookIcon} /></a>
            <a href="https://www.youtube.com/channel/UC5UXsZSRBnF7sVBi0egZz6g"><img alt="Youtube" src={YoutubeIcon} /></a>
            <a href="https://www.instagram.com/officialjennychem/"><img alt="Instagram" src={InstagramIcon} /></a>
            <a href="https://tiktok.com/@jennychem.com"><img alt="Tiktok" src={TiktokIcon} /></a>
          </div>
        </div>
        <form className='max-w-none'>
          <div className="flex flex-row items-center gap-2">
            <h3 style={{ marginBottom: "-3px" }} className='text-white font-display text-2xl'>Join Our Mailing List For Updates & Offers:</h3>
            <input
              className='rounded-full px-4 py-1 w-64'
              placeholder='Enter your email address'
            />
            <LightBlueArrowButton onClick={() => { }} label='Sign Up' />
          </div>
        </form>
      </div>
    </div>
  }
}

function FooterMenu({
  viewport = 'desktop',
  menu,
  siteMapMenu,
  primaryDomainUrl,
}: {
  viewport?: Viewport;
  menu: FooterQuery['menu'];
  siteMapMenu: FooterQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const { publicStoreDomain } = useRootLoaderData();

  if (viewport === 'mobile') {
    return (
      <div className='flex flex-col p-6 justify-between items-center container'>
        <SiteMap viewport={'mobile'} siteMapMenu={siteMapMenu} primaryDomainUrl={primaryDomainUrl} />
        <div className='flex flex-col my-6 items-center justify-end gap-4'>
          <img className="w-48 h-auto -ml-6" alt="logo" src='https://cdn.shopify.com/s/files/1/0032/5474/7185/files/jennychem_logo_24.png?v=1720257895' />
          <div className="flex flex-row gap-1">
            <a href="https://www.facebook.com/Officialjennychem/"><img alt="Facebook" src={FacebookIcon} /></a>
            <a href="https://www.youtube.com/channel/UC5UXsZSRBnF7sVBi0egZz6g"><img alt="Youtube" src={YoutubeIcon} /></a>
            <a href="https://www.instagram.com/officialjennychem/"><img alt="Instagram" src={InstagramIcon} /></a>
            <a href="https://tiktok.com/@jennychem.com"><img alt="Tiktok" src={TiktokIcon} /></a>
          </div>
          <nav className="text-white text-center font-body text-xs divide-x divide-white pt-3" role="navigation">
            {(menu || FALLBACK_FOOTER_MENU).items.map((item, index) => {
              if (!item.url) return null;
              // if the url is internal, we strip the domain
              const url =
                item.url.includes('myshopify.com') ||
                  item.url.includes(publicStoreDomain) ||
                  item.url.includes(primaryDomainUrl)
                  ? new URL(item.url).pathname
                  : item.url;
              const isExternal = !url.startsWith('/');
              return isExternal ? (
                <a className={`px-2 ${index === 0 ? 'pl-0' : ''} ${index === (menu || FALLBACK_FOOTER_MENU).items.length - 1 ? 'pr-0' : ''}`} href={url} key={item.id} rel="noopener noreferrer" target="_blank">
                  {item.title}
                </a>
              ) : (
                <NavLink
                  className={`!no-underline px-2 ${index === 0 ? 'pl-0' : ''} ${index === (menu || FALLBACK_FOOTER_MENU).items.length - 1 ? 'pr-0' : ''}`}
                  end
                  key={item.id}
                  prefetch="intent"
                  style={activeLinkStyle}
                  to={url}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
          <p className='text-white text-xs text-center'>
            &copy; 2024, Jennychem Limited | All Rights Reserved.<br />
            Company registration number: 00000000 | VAT number: GB 000000000
          </p>
        </div>
      </div>
    )
  } else {
    return (

      <div className='flex flex-row p-10 justify-between container'>
        <div className='z-10'>
          <SiteMap siteMapMenu={siteMapMenu} primaryDomainUrl={primaryDomainUrl} />
          <nav className="text-white font-body text-xs divide-x divide-white flex pt-10" role="navigation">
            {(menu || FALLBACK_FOOTER_MENU).items.map((item, index) => {
              if (!item.url) return null;
              // if the url is internal, we strip the domain
              const url =
                item.url.includes('myshopify.com') ||
                  item.url.includes(publicStoreDomain) ||
                  item.url.includes(primaryDomainUrl)
                  ? new URL(item.url).pathname
                  : item.url;
              const isExternal = !url.startsWith('/');
              return isExternal ? (
                <a className={`px-2 ${index === 0 ? 'pl-0' : ''} ${index === (menu || FALLBACK_FOOTER_MENU).items.length - 1 ? 'pr-0' : ''}`} href={url} key={item.id} rel="noopener noreferrer" target="_blank">
                  {item.title}
                </a>
              ) : (
                <NavLink
                  className={`!no-underline px-2 ${index === 0 ? 'pl-0' : ''} ${index === (menu || FALLBACK_FOOTER_MENU).items.length - 1 ? 'pr-0' : ''}`}
                  end
                  key={item.id}
                  prefetch="intent"
                  style={activeLinkStyle}
                  to={url}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className='flex flex-col items-end justify-end gap-4 z-10'>
          <img className="w-48 h-auto" alt="logo" src='https://cdn.shopify.com/s/files/1/0032/5474/7185/files/jennychem_logo_24.png?v=1720257895' />
          <img className='w-[240px] h-auto' src={'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/payment-light.png?v=1727549427'} />
          <p className='text-white text-xs text-right'>
            &copy; 2024, Jennychem Limited | All Rights Reserved.<br />
            Company registration number: 00000000 | VAT number: GB 000000000
          </p>
        </div>
      </div>

    );
  }


}

function SiteMap({ viewport = 'desktop', siteMapMenu, primaryDomainUrl }: { viewport?: Viewport, siteMapMenu: FooterQuery['menu']; primaryDomainUrl: string }) {

  const { publicStoreDomain } = useRootLoaderData();

  if (viewport === 'mobile') {
    return <div className='flex flex-col w-full'>
      <Accordion collapsible type="single">
        {siteMapMenu?.items.map((section, index) => (
          <AccordionItem key={index} value={`value_${index}`} className="border-b-2 border-jc-light-blue">
            <AccordionTrigger>
              <div key={section.id} className='flex items-center w-full hover:underline justify-between flex-row '>
                <h3 className='text-white font-body text-xl'>{section.title}</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 '>
              {section.items?.map((item) => {
                if (!item.url) return null;
                const url =
                  item.url.includes('myshopify.com') ||
                    item.url.includes(publicStoreDomain) ||
                    item.url.includes(primaryDomainUrl)
                    ? new URL(item.url).pathname
                    : item.url;
                return (
                  <NavLink
                    key={item.id}
                    className='text-white font-body pb-1 text-xsm'
                    to={url}
                  >{item.title}</NavLink>
                )
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <NavLink className={"!no-underline"} to="https://shopify.com/3254747185/account">
        <div className='flex items-center justify-between py-3 flex-row border-b-2 border-jc-light-blue'>
          <h3 className='text-white font-body text-xl'>Trade & Customer Login</h3>
          <CircleChevronRight color='white' className='w-6 h-6' strokeWidth={1} />
        </div>
      </NavLink>
    </div >
  } else {
    return <div className='flex flex-row gap-6'>
      {
        siteMapMenu?.items.map((section) => (
          <div key={section.id} className='flex flex-col gap-2 w-40'>
            <strong><h3 className='text-white font-body text-2xl border-b border-jc-light-blue pb-2 font-bold'>{section.title}</h3></strong>
            {section.items?.map((item) => {
              if (!item.url) return null;
              const url =
                item.url.includes('myshopify.com') ||
                  item.url.includes(publicStoreDomain) ||
                  item.url.includes(primaryDomainUrl)
                  ? new URL(item.url).pathname
                  : item.url;
              return (
                <NavLink
                  key={item.id}
                  className='text-white !no-underline font-body pb-1 text-xs border-b border-jc-light-blue'
                  to={url}
                >{item.title}</NavLink>
              )
            })}
          </div>
        ))
      }
    </div>
  }


}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
