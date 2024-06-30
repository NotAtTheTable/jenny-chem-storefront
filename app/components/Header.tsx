import { Await, NavLink } from '@remix-run/react';
import { Suspense } from 'react';
import type { HeaderQuery } from 'storefrontapi.generated';
import type { LayoutProps } from './Layout';
import { useRootLoaderData } from '~/lib/root-data';
import ContactIcon from "~/assets/foundational/contact_icon.svg"
import ProfilePlaceholderIcon from "~/assets/foundational/profile_placeholder.svg"
import BasketIcon from "~/assets/foundational/basket_icon.svg"
import { AlignJustify, Dot, Search, SearchIcon } from 'lucide-react';
import HeaderDropDown from './header/HeaderDropDown';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn'>;

type Viewport = 'desktop' | 'mobile';

export function Header({ header, isLoggedIn, cart }: HeaderProps) {
  const { shop, menu } = header;
  return (
    <div className='drop-shadow-lg bg-gradient-to-b from-jc-dark-blue-100 to-jc-dark-blue relative'>
      <header className="container text-white flex justify-between items-center w-full p-4 lg:p-0">
        <div className='flex flex-row gap-4 absolute'>
          <HeaderMenuMobileToggle />
          <HeaderMobileSearchToggle />
        </div>
        <NavLink className="flex-1 flex justify-center lg:justify-start" prefetch="intent" to="/" end>
          <img className="w-32 min-w-32 h-auto" alt="logo" src='https://cdn.shopify.com/s/files/1/0032/5474/7185/files/LogoImg.webp?v=1686824190' />
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>
    </div >

  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
}) {
  const { publicStoreDomain } = useRootLoaderData();
  const className = `header-menu-${viewport} font-display font-bold divide-x divide-jc-light-blue`;

  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item px-4 my-6"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            to={url}
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
      <NavLink className={"flex flex-col items-center desktop-only"} prefetch="intent" to="/account">
        <img alt="contact-icon" className="h-7" src={ContactIcon} />
        <p className='font-body mt-1' style={{ fontSize: "9px" }}>CONTACT</p>
      </NavLink>
      <NavLink className={"flex flex-col items-center desktop-only"} prefetch="intent" to="/account">
        <img alt="profile-placeholder" className="h-7" src={ProfilePlaceholderIcon} />
        <p className='font-body mt-1' style={{ fontSize: "9px" }}>
          <Suspense fallback="Sign in">
            <Await resolve={isLoggedIn} errorElement="SIGN IN">
              {(isLoggedIn) => (isLoggedIn ? 'ACCOUNT' : 'SIGN IN')}
            </Await>
          </Suspense>
        </p>
      </NavLink>
      <NavLink className={"flex flex-col items-center"} prefetch="intent" to="/account">
        <Suspense>
          <Await resolve={cart}>
            {(cart) => {
              return <Basket isActive={cart && cart.totalQuantity > 0} />
            }}
          </Await>
        </Suspense>
        <p className='font-body mt-1 desktop-only' style={{ fontSize: "9px" }}>BASKET</p>
      </NavLink>
      <NavLink prefetch="intent" to="/account">

      </NavLink>
    </nav>
  );
}

function Basket({ isActive = false }: { isActive?: boolean | null }) {
  return (
    <div className="relative">
      <img alt="basket-icon" className="h-7" src={BasketIcon} />
      {isActive &&
        <div className="text-xl absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-2 w-2 bg-white rounded-full"></div>
        </div>
      }
    </div>
  )
}

function HeaderMenuMobileToggle() {
  return (
    <a className='mobile-only' href="#mobile-menu-aside">
      <AlignJustify className='text-jc-light-blue' />
    </a>
  );
}

function HeaderMobileSearchToggle() {
  return (
    <a className='mobile-only' href="#mobile-search">
      <SearchIcon className='text-jc-light-blue' />
    </a>
  )
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