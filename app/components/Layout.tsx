import { Await } from '@remix-run/react';
import { Suspense } from 'react';
import type {
  CartApiQueryFragment,
  CollectionGroupsQuery,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import { Aside } from '~/components/Aside';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { CartMain } from '~/components/Cart';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  siteMap: Promise<FooterQuery>;
  header: HeaderQuery;
  collectionGroups: CollectionGroupsQuery;
  isLoggedIn: Promise<boolean>;
  isHeaderBannerClosed: boolean;
};

export function Layout({
  cart,
  children = null,
  footer,
  siteMap,
  header,
  collectionGroups,
  isLoggedIn,
  isHeaderBannerClosed
}: LayoutProps) {
  return (
    <>
      <CartAside cart={cart} />
      {header &&
        <Header
          header={header}
          collectionGroups={collectionGroups}
          cart={cart}
          isLoggedIn={isLoggedIn}
          isHeaderBannerClosed={isHeaderBannerClosed}
        />}
      <main>{children}</main>
      <Suspense>
        <Await resolve={Promise.all([footer, siteMap])}>
          {([footer, siteMap]) => <Footer menu={footer?.menu} siteMapMenu={siteMap?.menu} shop={header?.shop} />}
        </Await>
      </Suspense>
    </>
  );
}

function CartAside({ cart }: { cart: LayoutProps['cart'] }) {
  return (
    <Aside id="cart-aside" heading="YOUR BASKET">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

// function SearchAside() {
//   return (
//     <Aside id="search-aside" heading="SEARCH">
//       <div className="predictive-search">
//         <br />
//         <PredictiveSearchForm>
//           {({ fetchResults, inputRef }) => (
//             <div>
//               <input
//                 name="q"
//                 onChange={fetchResults}
//                 onFocus={fetchResults}
//                 placeholder="Search"
//                 ref={inputRef}
//                 type="search"
//               />
//               &nbsp;
//               <button
//                 onClick={() => {
//                   window.location.href = inputRef?.current?.value
//                     ? `/search?q=${inputRef.current.value}`
//                     : `/search`;
//                 }}
//               >
//                 Search
//               </button>
//             </div>
//           )}
//         </PredictiveSearchForm>
//       </div>
//     </Aside>
//   );
// }
