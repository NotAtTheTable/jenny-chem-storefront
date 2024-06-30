import { NavLink } from '@remix-run/react';
import type { FooterQuery, HeaderQuery } from 'storefrontapi.generated';
import { useRootLoaderData } from '~/lib/root-data';
import FacebookIcon from '~/assets/social-icons/facebook-white.svg'
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
  shop,
}: FooterQuery & { shop: HeaderQuery['shop'] }) {

  const isMobile = useViewport();
  if (isMobile !== null) {
    return (

      <footer className="footer">
        <MailingListBanner viewport={isMobile ? 'mobile' : 'desktop'} />
        <BlueBubbleBackground>
          {menu && shop?.primaryDomain?.url && (
            <FooterMenu viewport={isMobile ? 'mobile' : 'desktop'} menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
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
        <h3 style={{ lineHeight: 'inherit' }} className='text-white font-display text-2xl'>Join Our Mailing List For Updates & Offers:</h3>
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
            <h3 style={{ lineHeight: "0.8em" }} className='text-white font-display text-2xl'>Join Our Mailing List For Updates & Offers:</h3>
            <input
              className='rounded-full px-8 py-1 w-64'
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
  primaryDomainUrl,
}: {
  viewport?: Viewport;
  menu: FooterQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const { publicStoreDomain } = useRootLoaderData();

  if (viewport === 'mobile') {
    return <div>
      <div className='flex flex-col p-6 justify-between items-center container'>
        <SiteMap viewport={'mobile'} />
        <div className='flex flex-col my-6 items-center justify-end gap-4'>
          <img className="w-48 h-auto -ml-6" alt="logo" src='https://cdn.shopify.com/s/files/1/0032/5474/7185/files/LogoImg.webp?v=1686824190' />
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
                  className={`px-2 ${index === 0 ? 'pl-0' : ''} ${index === (menu || FALLBACK_FOOTER_MENU).items.length - 1 ? 'pr-0' : ''}`}
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
    </div>
  } else {
    return (
      <div className="bg-jc-dark-blue">
        <div className='flex flex-row p-10 justify-between container'>
          <div>
            <SiteMap />
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
                    className={`px-2 ${index === 0 ? 'pl-0' : ''} ${index === (menu || FALLBACK_FOOTER_MENU).items.length - 1 ? 'pr-0' : ''}`}
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
          <div className='flex flex-col items-end justify-end gap-4'>
            <img className="w-48 h-auto" alt="logo" src='https://cdn.shopify.com/s/files/1/0032/5474/7185/files/LogoImg.webp?v=1686824190' />
            <p className='text-white text-xs text-right'>
              &copy; 2024, Jennychem Limited | All Rights Reserved.<br />
              Company registration number: 00000000 | VAT number: GB 000000000
            </p>
          </div>
        </div>
      </div>
    );
  }


}

function SiteMap({ viewport = 'desktop' }: { viewport?: Viewport }) {

  const data = [{
    heading: "Company",
    links: [
      {
        label: "About Us",
        href: "/about"
      },
      {
        label: "Blog",
        href: "/blog"
      },
      {
        label: "Trade & Customer Login",
        href: "/trade-and-customer-login"
      },
      {
        label: "Search",
        href: "/search"
      }
    ]
  },
  {
    heading: "Support",
    links: [
      {
        label: "Contact",
        href: "/contact"
      },
      {
        label: "Shipping Rates",
        href: "/shipping-rates"
      },
      {
        label: "Order Returns",
        href: "/order-returns"
      },
      {
        label: "Distributors",
        href: "/distributors"
      }
    ]
  },
  {
    heading: "Other",
    links: [
      {
        label: "Sample Kit",
        href: "/privacy-policy"
      },
      {
        label: "Dilution Calculator",
        href: "/terms-of-service"
      },
      {
        label: "Services",
        href: "/privacy-policy"
      },
      {
        label: "Basket",
        href: "/terms-of-service"
      }
    ]

  }]

  if (viewport === 'mobile') {
    return <div className='flex flex-col w-full'>
      <Accordion collapsible type="single">
        {data.map((section, index) => (
          <AccordionItem key={index} value={`value_${index}`} className="border-b-2 border-jc-light-blue">
            <AccordionTrigger>
              <div key={section.heading} className='flex items-center w-full justify-between flex-row '>
                <h3 className='text-white font-body text-xl'>{section.heading}</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 '>
              {section.links.map((link) => (
                <a key={link.href} className='text-white font-body pb-1 text-xsm' href={link.href}>{link.label}</a>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <NavLink to="https://shopify.com/3254747185/account">
        <div className='flex items-center justify-between py-3 flex-row border-b-2 border-jc-light-blue'>
          <h3 className='text-white font-body text-xl'>Trade & Customer Login</h3>
          <CircleChevronRight color='white' className='w-6 h-6' strokeWidth={1} />
        </div>
      </NavLink>
    </div >
  } else {
    return <div className='flex flex-row gap-6'>
      {
        data.map((section) => (
          <div key={section.heading} className='flex flex-col gap-2 w-40'>
            <h3 className='text-white font-body text-xl border-b-2 border-jc-light-blue pb-4 font-bold'>{section.heading}</h3>
            {section.links.map((link) => (
              <a key={link.href} className='text-white font-body pb-1 text-xs border-b border-jc-light-blue' href={link.href}>{link.label}</a>
            ))}
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
