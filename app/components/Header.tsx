import { Await, NavLink, useFetcher, useSearchParams } from '@remix-run/react';
import { Suspense } from 'react';
import type { HeaderQuery } from 'storefrontapi.generated';
import type { LayoutProps } from './Layout';
import { useRootLoaderData } from '~/lib/root-data';
import ContactIcon from "~/assets/foundational/contact_icon.svg"
import ParcelIcon from "~/assets/foundational/parcel_icon.svg"
import ProfilePlaceholderIcon from "~/assets/foundational/profile_placeholder.svg"
import BasketIcon from "~/assets/foundational/basket_icon.svg"
import { AlignJustify, Plus, Search, SearchIcon, X } from 'lucide-react';
import HeaderDropDown from './header/HeaderDropDown';
import MobileMenu from './header/MobileMenu';
import { Button } from './foundational/ArrowButton';
import SearchDropDown from './header/SearchDropDown';
import MobileSearchDropDown from './header/MobileSearchDropDown';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn' | 'collectionGroups' | 'isHeaderBannerClosed'>;

export function Header({ header, isHeaderBannerClosed, isLoggedIn, collectionGroups, cart }: HeaderProps) {
  const { shop, menu } = header;

  const [searchParams, setSearchParams] = useSearchParams();
  const navMobileDrawer = searchParams.get('nav-mobile-drawer') || null;
  const navSearch = searchParams.get('nav-search') || null;

  function toggleMobileMenu() {
    setSearchParams((prev) => {
      const currentVal = prev.get('nav-mobile-drawer');
      prev = resetSearchParams(prev);
      if (currentVal !== 'menu' && currentVal !== 'search') {
        prev.set('nav-mobile-drawer', 'menu');
      }
      return prev;
    }, { preventScrollReset: true });
  }

  function toggleMobileSearch() {
    setSearchParams((prev) => {
      const currentVal = prev.get('nav-mobile-drawer');
      prev = resetSearchParams(prev);
      if (currentVal !== 'search') {
        prev.set('nav-mobile-drawer', 'search');
      }
      return prev;
    }, { preventScrollReset: true });
  }

  return (<>
    <div className='sticky top-0 z-50 shadow'>
      <HeaderBanner isClosed={isHeaderBannerClosed}></HeaderBanner>
      <div className='bg-gradient-to-b from-jc-dark-blue-100 to-jc-dark-blue'>
        <header className="container text-white flex justify-between items-center w-full p-4 lg:p-0">
          <div className='absolute flex flex-row gap-4 '>
            <button className='mobile-only' onClick={() => toggleMobileMenu()}>
              {navMobileDrawer ? <Plus strokeWidth={1.5} className='text-jc-light-blue rotate-45 scale-150' /> : <AlignJustify className='text-jc-light-blue' />}
            </button>
            <button className='mobile-only' onClick={() => toggleMobileSearch()}>
              <SearchIcon className='text-jc-light-blue' />
            </button>
          </div>
          <NavLink className="flex-1 flex justify-center" prefetch="intent" to="/" end>
            <img className="w-32 min-w-32 h-auto" alt="logo" src='https://cdn.shopify.com/s/files/1/0032/5474/7185/files/jennychem_logo_24.png?v=1720257895' />
          </NavLink>
          <div className='desktop-component'>
            <HeaderMenu
              menu={menu}
              primaryDomainUrl={shop.primaryDomain.url}
            />
          </div>
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </header>
      </div>
      <HeaderDropDown
        menu={menu}
        collectionGroups={collectionGroups}
        primaryDomainUrl={shop.primaryDomain.url}
      />
      {navSearch === "true" && <SearchDropDown />}
    </div>
    {!!navMobileDrawer &&
      <MobileHeaderDropDown
        isHeaderBannerClosed={isHeaderBannerClosed}
        isVisible={!!navMobileDrawer}
      >
        {navMobileDrawer === "menu" &&
          < MobileMenu
            menu={menu}
            collectionGroups={collectionGroups}
            primaryDomainUrl={shop.primaryDomain.url}
          />
        }
        {
          navMobileDrawer === "search" &&
          <MobileSearchDropDown />
        }
      </MobileHeaderDropDown>
    }
  </>
  );
}

export function resetSearchParams(prev: URLSearchParams): URLSearchParams {
  prev.delete("nav-mobile-drawer");
  prev.delete("nav-menu-id");
  prev.delete("nav-search");
  return prev;
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
}) {
  const { publicStoreDomain } = useRootLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const navMenuId = searchParams.get('nav-menu-id') || null;

  const className = `font-display tracking-wider font-bold line divide-x divide-jc-light-blue flex flex-row`;

  return (
    <nav className={className} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item, index) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <>
            {
              item.items.length > 0 ?
                <button
                  className={`header-menu-item !no-underline px-4 my-6 ${(navMenuId === item.id) ? "text-jc-light-blue" : ""}`}
                  key={item.id}
                  name="nav-menu-id"
                  onClick={() => {
                    setSearchParams((prev) => {
                      prev.delete("nav-search");
                      prev.set("nav-menu-id", item.id);
                      return prev;
                    }, { preventScrollReset: true });
                  }}
                >
                  {item.title}
                </button>
                :
                <NavLink
                  key={item.id}
                  className={`header-menu-item !no-underline px-4 my-6`}
                  end
                  prefetch="intent"
                  to={url}>
                  {item.title}
                </NavLink>
            }
          </>
        );
      })}
      <button onClick={() => {
        setSearchParams((prev) => {
          prev.delete("nav-menu-id");
          prev.set("nav-search", "true");
          return prev;
        }, { preventScrollReset: true });
      }}
        className="!no-underline header-menu-item flex px-2 my-6"
      >
        <Search style={{ marginTop: "3px" }} height={15} />
        Search
      </button>
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavLink className={"flex flex-col items-center desktop-only !no-underline"} prefetch="intent" to="https://jennychem.aftership.com/?page-name=tracking-page">
        <img alt="contact-icon" className="h-7" src={ParcelIcon} />
        <p className='font-body mt-1' style={{ fontSize: "9px" }}>TRACKING</p>
      </NavLink>
      <NavLink className={"flex flex-col items-center desktop-only !no-underline"} prefetch="intent" to="/contact">
        <img alt="contact-icon" className="h-7" src={ContactIcon} />
        <p className='font-body mt-1' style={{ fontSize: "9px" }}>CONTACT</p>
      </NavLink>
      <NavLink className={"flex flex-col items-center desktop-only !no-underline"} prefetch="intent" to={"https://shopify.com/3254747185/account"}>
        <img alt="profile-placeholder" className="h-7" src={ProfilePlaceholderIcon} />
        <p className='font-body mt-1' style={{ fontSize: "9px" }}>
          <Suspense fallback="Sign in">
            <Await resolve={isLoggedIn} errorElement="SIGN IN">
              {(isLoggedIn) => (isLoggedIn ? 'ACCOUNT' : 'SIGN IN')}
            </Await>
          </Suspense>
        </p>
      </NavLink>
      <a className={"flex flex-col items-center !no-underline"} href="#cart-aside">
        <Suspense>
          <Await resolve={cart}>
            {(cart) => {
              return <Basket isActive={cart && cart.totalQuantity > 0} />
            }}
          </Await>
        </Suspense>
        <p className='font-body mt-1 desktop-only' style={{ fontSize: "9px" }}>BASKET</p>
      </a>
      <NavLink prefetch="intent" to="/account">

      </NavLink>
    </nav>
  );
}

function Basket({ isActive = false }: { isActive?: boolean | null }) {
  return (
    <div className="relative">
      <img alt="basket-icon" className="h-6 md:h-7" src={BasketIcon} />
      {isActive &&
        <div className="text-xl absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-1.5 w-1.5 md:h-2 md:w-2 bg-white rounded-full"></div>
        </div>
      }
    </div>
  )
}


function HeaderBanner({ isClosed }: { isClosed: boolean }) {
  const fetcher = useFetcher();

  if (fetcher.formData?.has("isHeaderBannerClosed")) {
    isClosed = fetcher.formData.get("isHeaderBannerClosed") === "true"
  }

  return (
    <div className={`bg-jc-light-blue flex flex-row items-center justify-center gap-4 relative transition-all duration-300 ${!isClosed ? 'h-[42px]' : 'h-0 overflow-hidden'}`}>
      <h4 className={`text-white text-xs md:text-sm`}><span className='desktop-component'>3-5 WORKING DAY DELIVERY &nbsp; | &nbsp;</span>  FREE DELIVERY ON SELECTED ORDERS OVER £25*</h4>
      <Button className='w-max [&_p]:text-[10px] py-0 border-none desktop-component' label='More Info' />
      <div className="absolute top-1/2 right-1 -translate-y-1/2">
        <fetcher.Form method="post">
          <button name="isHeaderBannerClosed" value={isClosed ? "false" : "true"} className="text-white rounded-full w-8 h-8 flex items-center justify-center">
            <Plus className="rotate-45" strokeWidth={1.5} />
          </button>
        </fetcher.Form>
      </div>
    </div>
  )
}

function MobileHeaderDropDown({ isVisible, isHeaderBannerClosed, children }: { isVisible: boolean; isHeaderBannerClosed: boolean; children: React.ReactNode }) {
  return (
    <div className={`z-[49] ${isHeaderBannerClosed ? "top-[78px]" : "top-[120px]"} w-full overflow-hidden fixed bg-white transition-height duration-200 ease-in-out shadow-lg ${isVisible ? 'h-screen block' : 'h-0 hidden'}`}>
      {children}
    </div>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};