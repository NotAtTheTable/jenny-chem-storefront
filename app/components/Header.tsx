import { Await, NavLink } from '@remix-run/react';
import { Suspense, useEffect, useRef, useState } from 'react';
import type { HeaderQuery } from 'storefrontapi.generated';
import type { LayoutProps } from './Layout';
import { useRootLoaderData } from '~/lib/root-data';
import ContactIcon from "~/assets/foundational/contact_icon.svg"
import ParcelIcon from "~/assets/foundational/parcel_icon.svg"
import ProfilePlaceholderIcon from "~/assets/foundational/profile_placeholder.svg"
import BasketIcon from "~/assets/foundational/basket_icon.svg"
import { AlignJustify, Cross, Dot, Plus, Search, SearchIcon, X } from 'lucide-react';
import HeaderDropDown from './header/HeaderDropDown';
import MobileMenu from './header/MobileMenu';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

const SERVICES_NAV_ITEM_ID = "gid://shopify/MenuItem/475474723008";

export function Header({ header, isLoggedIn, cart }: HeaderProps) {
  const { shop, menu } = header;

  const [selectedMenuItemIndex, setSelectedMenuItemIndex] = useState<number | null>(null);
  const [mobileMenuVisible, setMobileMenuVisible] = useState<boolean>(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState<boolean>(false);

  const headerRef = useRef<HTMLDivElement>(null); // Create a ref for the header height
  const [headerHeight, setHeaderHeight] = useState<number>(0); // State to store header height

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight); // Set header height on mount
    }
  }, [headerRef]);

  return (<>
    <div ref={headerRef} className='sticky top-0 z-50 shadow-[0_3_9px_rgba(0,0,0,0.4)] bg-gradient-to-b from-jc-dark-blue-100 to-jc-dark-blue'>
      <header className="container text-white flex justify-between items-center w-full p-4 lg:p-0">
        <div className='absolute flex flex-row gap-4'>
          <button className='mobile-only' onClick={() => setMobileMenuVisible(!mobileMenuVisible)}>
            {mobileMenuVisible ? <Plus strokeWidth={1.5} className='text-jc-light-blue rotate-45 scale-150' /> : <AlignJustify className='text-jc-light-blue' />}
          </button>
          <button className='mobile-only' onClick={() => setMobileSearchVisible(!mobileSearchVisible)}>
            <SearchIcon className='text-jc-light-blue' />
          </button>
        </div>
        <NavLink onMouseEnter={() => setSelectedMenuItemIndex(null)} className="flex-1 flex justify-center" prefetch="intent" to="/" end>
          <img className="w-32 min-w-32 h-auto" alt="logo" src='https://cdn.shopify.com/s/files/1/0032/5474/7185/files/jennychem_logo_24.png?v=1720257895' />
        </NavLink>
        <div className='desktop-component'>
          <HeaderMenu
            menu={menu}
            primaryDomainUrl={shop.primaryDomain.url}
            handleSelectedMenuItemIndex={setSelectedMenuItemIndex}
            selectedMenuItemIndex={selectedMenuItemIndex}
          />
        </div>
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>
      <HeaderDropDown
        isHidden={(selectedMenuItemIndex !== null && [0, 1, 2, 3].includes(selectedMenuItemIndex))}
        menu={menu} selectedIndex={selectedMenuItemIndex || 0}
        handleSelectedMenuItemIndex={setSelectedMenuItemIndex}
        primaryDomainUrl={shop.primaryDomain.url}
      />
    </div>
    <MobileHeaderDropDown headerHeight={headerHeight} isVisible={mobileMenuVisible}
    >
      <MobileMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
    </MobileHeaderDropDown>
    <MobileHeaderDropDown headerHeight={headerHeight} isVisible={mobileSearchVisible}
    >
      <div>Here's the search</div>
    </MobileHeaderDropDown>
  </>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  handleSelectedMenuItemIndex,
  selectedMenuItemIndex
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  handleSelectedMenuItemIndex: (index: number | null) => void;
  selectedMenuItemIndex: number | null;
}) {
  const { publicStoreDomain } = useRootLoaderData();
  const className = `shadow font-display tracking-wider font-bold line divide-x divide-jc-light-blue flex flex-row`;

  return (
    <nav className={className} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item, index) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        if (item.id === SERVICES_NAV_ITEM_ID) {
          item.url = "/services"
        }
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className={`header-menu-item px-4 my-6 ${(selectedMenuItemIndex === index) ? "text-jc-light-blue" : ""}`}
            end
            key={item.id}
            onTouchStart={() => handleSelectedMenuItemIndex(index)}
            prefetch="intent"
            to={url}
            onMouseEnter={() => handleSelectedMenuItemIndex(index)}
          >
            {item.title}
          </NavLink>
        );
      })}
      <a href="#search-aside" className="header-menu-item flex px-2 my-6"><Search style={{ marginTop: "3px" }} height={15} />Search</a>
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <NavLink className={"flex flex-col items-center desktop-only"} prefetch="intent" to="https://jennychem.aftership.com/?page-name=tracking-page">
        <img alt="contact-icon" className="h-7" src={ParcelIcon} />
        <p className='font-body mt-1' style={{ fontSize: "9px" }}>TRACKING</p>
      </NavLink>
      <NavLink className={"flex flex-col items-center desktop-only"} prefetch="intent" to="/contact">
        <img alt="contact-icon" className="h-7" src={ContactIcon} />
        <p className='font-body mt-1' style={{ fontSize: "9px" }}>CONTACT</p>
      </NavLink>
      <NavLink className={"flex flex-col items-center desktop-only"} prefetch="intent" to={"https://shopify.com/3254747185/account"}>
        <img alt="profile-placeholder" className="h-7" src={ProfilePlaceholderIcon} />
        <p className='font-body mt-1' style={{ fontSize: "9px" }}>
          <Suspense fallback="Sign in">
            <Await resolve={isLoggedIn} errorElement="SIGN IN">
              {(isLoggedIn) => (isLoggedIn ? 'ACCOUNT' : 'SIGN IN')}
            </Await>
          </Suspense>
        </p>
      </NavLink>
      <a className={"flex flex-col items-center"} href="#cart-aside">
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

function MobileHeaderDropDown({ isVisible, headerHeight, children }: { headerHeight: number; isVisible: boolean; children: React.ReactNode }) {
  return (
    <div className={`z-[49] pt-[${headerHeight || 0}px] w-full overflow-hidden fixed bg-white transition-height duration-200 ease-in-out shadow-lg ${isVisible ? 'h-screen' : 'h-0'}`}>
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