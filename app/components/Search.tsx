import {
  Link,
  Form,
  useParams,
  useFetcher,
  type FormProps,
  useNavigate,
  useSearchParams,
  NavLink,
} from '@remix-run/react';
import { Image, Money, Pagination } from '@shopify/hydrogen';
import React, { useRef, useEffect, useMemo } from 'react';
import { applyTrackingParams } from '~/lib/search';

import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

import type {
  PredictiveProductFragment,
  SearchQuery,
} from 'storefrontapi.generated';
import ProductCard, { MiniProductCard } from './card/ProductCard';
import { ArrowButton, DownArrowButton, MiniArrowButton } from './foundational/ArrowButton';
import { SearchIcon } from 'lucide-react';

type PredicticeSearchResultItemImage =
  // | PredictiveCollectionFragment['image']
  // | PredictiveArticleFragment['image']
  | PredictiveProductFragment['variants']['nodes'][0]['image'];

type PredictiveSearchResultItemPrice =
  | PredictiveProductFragment['variants']['nodes'][0]['price'];

type PredictiveSearchResultsItemTrackingParameters =
  | PredictiveProductFragment['trackingParameters']

export type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  trackingParameters?: PredictiveSearchResultsItemTrackingParameters;
  image?: PredicticeSearchResultItemImage;
  price?: PredictiveSearchResultItemPrice;
  styledTitle?: string;
  title: string;
  url: string;
};

export type NormalizedPredictiveSearchResults = Array<
  | { type: 'queries'; items: Array<NormalizedPredictiveSearchResultItem> }
  | { type: 'products'; items: Array<NormalizedPredictiveSearchResultItem> }
  | { type: 'collections'; items: Array<NormalizedPredictiveSearchResultItem> }
  | { type: 'pages'; items: Array<NormalizedPredictiveSearchResultItem> }
  | { type: 'articles'; items: Array<NormalizedPredictiveSearchResultItem> }
>;

export type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults;
  totalResults: number;
};

type FetchSearchResultsReturn = {
  searchResults: {
    results: SearchQuery | null;
    totalResults: number;
  };
  searchTerm: string;
};

export const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = [
  { type: 'queries', items: [] },
  { type: 'products', items: [] },
  { type: 'collections', items: [] },
  { type: 'pages', items: [] },
  { type: 'articles', items: [] },
];

export function SearchForm({ searchTerm }: { searchTerm: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // focus the input when cmd+k is pressed
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full p-4 bg-[#EBF2FF] flex justify-center gap-1">
      <PredictiveSearchForm className="w-full max-w-full">
        {({ fetchResults, inputRef }) => {
          return (
            <Form className='!max-w-none' method="get">
              <div className='w-full flex justify-center gap-1'>
                <div className="relative w-full max-w-[750px] rounded-tl rounded-bl overflow-hidden">
                  <input
                    defaultValue={searchTerm}
                    name="q"
                    onChange={fetchResults}
                    placeholder="Product name, type or sku code"
                    className="rounded w-full p-2 pr-10 border-[0.75px] border-jc-light-blue focus:outline-none"
                    ref={inputRef}
                    type="search"
                    autoComplete="off"
                  />
                  <button
                    className='absolute right-0 top-0 bottom-0 rounded-tr rounded-br px-2 flex items-center bg-jc-light-blue'
                    type="submit"
                  >
                    <SearchIcon className='text-white w-[25px]' />
                  </button>
                </div>
              </div>
            </Form>)
        }}
      </PredictiveSearchForm>
      {/* <div className="absolute left-0 right-0 top-full bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] z-[15]">
        <PredictiveSearchResults />
      </div> */}
    </div>
  );
}

export function SearchResults({
  results,
  searchTerm,
}: Pick<FetchSearchResultsReturn['searchResults'], 'results'> & {
  searchTerm: string;
}) {
  if (!results) {
    return null;
  }
  const keys = Object.keys(results) as Array<keyof typeof results>;
  return (
    <div>
      {results &&
        keys.map((type) => {
          const resourceResults = results[type];

          // if (resourceResults.nodes[0]?.__typename === 'Page') {
          //   const pageResults = resourceResults as SearchQuery['pages'];
          //   return resourceResults.nodes.length ? (
          //     <SearchResultPageGrid key="pages" pages={pageResults} />
          //   ) : null;
          // }

          if (resourceResults.nodes[0]?.__typename === 'Product') {
            const productResults = resourceResults as SearchQuery['products'];
            return resourceResults.nodes.length ? (
              <SearchResultsProductsGrid
                key="products"
                products={productResults}
                searchTerm={searchTerm}
              />
            ) : null;
          }

          // if (resourceResults.nodes[0]?.__typename === 'Article') {
          //   const articleResults = resourceResults as SearchQuery['articles'];
          //   return resourceResults.nodes.length ? (
          //     <SearchResultArticleGrid
          //       key="articles"
          //       articles={articleResults}
          //     />
          //   ) : null;
          // }

          return null;
        })}
    </div>
  );
}

function SearchResultsProductsGrid({
  products,
  searchTerm,
}: Pick<SearchQuery, 'products'> & { searchTerm: string }) {
  return (
    <div className="search-result">
      <Pagination connection={products}>
        {({ nodes, isLoading, NextLink, PreviousLink }) => {
          const ItemsMarkup = nodes.map((product) => {
            const trackingParams = applyTrackingParams(
              product,
              `q=${encodeURIComponent(searchTerm)}`,
            );

            return (
              <div key={product.id}>
                <div className='desktop-component'>
                  <ProductCard
                    id={product.id}
                    imageData={product.variants.nodes[0].image as StorefrontAPI.Image}
                    title={product.title}
                    price={product.variants.nodes[0].price as StorefrontAPI.MoneyV2}
                    handle={product.handle}
                    ActionElement={() => <ArrowButton label="VIEW ALL SIZES" />}
                  />
                </div>
                <div className='mobile-component'>
                  <MiniProductCard
                    id={product.id}
                    imageData={product.variants.nodes[0].image as StorefrontAPI.Image}
                    title={product.title}
                    price={product.variants.nodes[0].price as StorefrontAPI.MoneyV2}
                    handle={product.handle}
                    ActionElement={() => <MiniArrowButton label="VIEW ALL SIZES" />}
                  />
                </div>
              </div>

            );
          });
          return (
            <div>
              <div className='desktop-component relative m-auto w-max grid grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5'>
                {ItemsMarkup}
                <br />
              </div>
              <div className='mobile-component mx-2 relative grid grid-cols-2 gap-1'>
                {ItemsMarkup}
                <br />
              </div>
              <div className='flex justify-center'>
                <NextLink><DownArrowButton label="View More" onClick={() => { }} /></NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
      <br />
    </div>
  );
}

function SearchResultPageGrid({ pages }: Pick<SearchQuery, 'pages'>) {
  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => (
          <div className="search-results-item" key={page.id}>
            <Link prefetch="intent" to={`/pages/${page.handle}`}>
              {page.title}
            </Link>
          </div>
        ))}
      </div>
      <br />
    </div>
  );
}

function SearchResultArticleGrid({ articles }: Pick<SearchQuery, 'articles'>) {
  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => (
          <div className="search-results-item" key={article.id}>
            <Link prefetch="intent" to={`/blogs/${article.handle}`}>
              {article.title}
            </Link>
          </div>
        ))}
      </div>
      <br />
    </div>
  );
}

export function NoSearchResults() {
  return <p>No results, try a different search.</p>;
}

type ChildrenRenderProps = {
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fetcher: ReturnType<typeof useFetcher<NormalizedPredictiveSearchResults>>;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

type SearchFromProps = {
  action?: FormProps['action'];
  className?: string;
  children: (passedProps: ChildrenRenderProps) => React.ReactNode;
  [key: string]: unknown;
};

/**
 *  Search form component that sends search requests to the `/search` route
 **/
export function PredictiveSearchForm({
  action,
  children,
  className = 'predictive-search-form',
  ...props
}: SearchFromProps) {
  const params = useParams();
  const fetcher = useFetcher<NormalizedPredictiveSearchResults>({
    key: 'search',
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {

    const searchAction = action ?? '/api/predictive-search';
    const newSearchTerm = event.target.value || '';
    const localizedAction = params.locale
      ? `/${params.locale}${searchAction}`
      : searchAction;
    fetcher.submit(
      { q: newSearchTerm, limit: '10' },
      { method: 'GET', action: localizedAction },
    );
  }

  // ensure the passed input has a type of search, because SearchResults
  // will select the element based on the input
  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
  }, []);

  return (
    <fetcher.Form
      {...props}
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!inputRef?.current || inputRef.current.value === '') {
          return;
        }
        inputRef.current.blur();
      }}
    >
      {children({ fetchResults, inputRef, fetcher })}
    </fetcher.Form>
  );
}

export function PredictiveSearchResults() {
  const { results, totalResults, searchInputRef, searchTerm, state } =
    usePredictiveSearch();
  // For when there is an indexed search
  function goToSearchResult(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!searchInputRef.current) return;
    searchInputRef.current.blur();
    searchInputRef.current.value = '';
    // close the aside
    window.location.href = event.currentTarget.href;
  }

  function handleQueryClick(query: string) {
    if (!searchInputRef.current) return;
    searchInputRef.current.value = query;
    searchInputRef.current.focus();
    const inputEvent = new Event("input", { bubbles: true });
    searchInputRef.current.dispatchEvent(inputEvent);
    const focusEvent = new FocusEvent("focus", { bubbles: true });
    searchInputRef.current.dispatchEvent(focusEvent);
  }

  // if (!totalResults) {
  //   return <NoPredictiveSearchResults searchTerm={searchTerm} />;
  // }

  if (totalResults === 0) {
    return null;
  }

  return <>
    <div className='desktop-component container flex flex-row py-6 gap-4'> {
      results.map(({ type, items }, index) => {
        switch (type) {
          case 'queries':
            // Handle article type
            return <div key={index} className='flex flex-col gap-2 w-80'>
              <strong><h3 className='text-jc-dark-blue font-body text-2xl border-b border-jc-dark-blue pb-2 font-bold'>Top Suggestions</h3></strong>
              {items.map((link) => (
                <button
                  key={link.id}
                  className='text-jc-dark-blue text-left !no-underline font-body pb-1 border-b-[0.75px] border-jc-light-blue-100'
                  onClick={() => handleQueryClick(link.title)}
                >{link.title}</button>
              ))}
            </div>;
          case 'products':
            // Handle product type
            return <ProductSearchResult
              goToSearchResult={goToSearchResult}
              items={items}
              key={index}
              searchTerm={searchTerm}
              type={type}
            />
              ;
          default:
            return null; // Handle unknown type
        }
      })
    }
    </div>
    <div className='mobile-component m-4'> {
      results.map(({ type, items }, index) => {
        switch (type) {
          case 'queries':
            // Handle article type
            return <div key={index} className='flex flex-col gap-2 min-w-80'>
              <strong><h3 className='text-jc-dark-blue font-body text-2xl border-b border-jc-dark-blue pb-2 font-bold'>Top Suggestions</h3></strong>
              {items.map((link) => (
                <NavLink
                  key={link.id}
                  className='text-jc-dark-blue text-left !no-underline font-body pb-1 border-b-[0.75px] border-jc-light-blue-100'
                  to={link.url}
                  prefetch="intent"
                >
                  {link.title}
                </NavLink>
              ))}
            </div>;
          default:
            return null; // Handle unknown type
        }
      })
    }
    </div>
  </>
}

function NoPredictiveSearchResults({
  searchTerm,
}: {
  searchTerm: React.MutableRefObject<string>;
}) {
  if (!searchTerm.current) {
    return null;
  }
  return (
    <p>
      No results found for <q>{searchTerm.current}</q>
    </p>
  );
}

type SearchResultTypeProps = {
  goToSearchResult: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  items: NormalizedPredictiveSearchResultItem[];
  searchTerm: UseSearchReturn['searchTerm'];
  type: NormalizedPredictiveSearchResults[number]['type'];
};

function NavigateToProductPageButton({ handle }: { handle: string }) {
  return <MiniArrowButton label="VIEW ALL SIZES" />
}

function ProductSearchResult({
  goToSearchResult,
  items,
  searchTerm,
  type,
}: SearchResultTypeProps) {
  return (
    <div key={type} className='grid flex-1 grid-cols-5 gap-2 h-[28rem] overflow-y-scroll'>
      {items.map((item: NormalizedPredictiveSearchResultItem) => (
        <div key={item.id} className='col-span-1'>
          <SearchResultItem
            item={item}
            searchTerm={searchTerm}
          />
        </div>
      ))}
    </div>
  );
}

type SearchResultItemProps = {
  item: NormalizedPredictiveSearchResultItem;
  searchTerm: UseSearchReturn['searchTerm'];
};

function SearchResultItem({ item, searchTerm }: SearchResultItemProps) {
  return (
    <Link
      className='!no-underline'
      prefetch="intent"
      to={`/products/${item.handle}`}
    >
      <MiniProductCard
        id={item.id}
        imageData={item.image as StorefrontAPI.Image}
        title={item.title}
        price={item.price as StorefrontAPI.MoneyV2}
        ActionElement={NavigateToProductPageButton}
        handle={item.handle}
      />
    </Link>
  );
}

type UseSearchReturn = NormalizedPredictiveSearch & {
  searchInputRef: React.MutableRefObject<HTMLInputElement | null>;
  searchTerm: React.MutableRefObject<string>;
  state: ReturnType<typeof useFetcher>['state'];
};

function usePredictiveSearch(): UseSearchReturn {
  const searchFetcher = useFetcher<FetchSearchResultsReturn>({ key: 'search' });
  const searchTerm = useRef<string>('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const prevSearchTerm = useRef('');

  if (searchFetcher?.state === 'loading' && prevSearchTerm.current !== searchFetcher.formData?.get('q')) {
    searchTerm.current = (searchFetcher.formData?.get('q') || '') as string;
    prevSearchTerm.current = searchTerm.current;
  }

  const search = useMemo(() => {
    return (searchFetcher?.data?.searchResults || {
      results: NO_PREDICTIVE_SEARCH_RESULTS,
      totalResults: 0,
    }) as NormalizedPredictiveSearch;
  }, [searchFetcher?.data?.searchResults]);

  useEffect(() => {
    if (searchInputRef.current) return;
    searchInputRef.current = document.querySelector('input[type="search"]');
  }, []);

  return { ...search, searchInputRef, searchTerm, state: searchFetcher.state };
}

/**
 * Converts a plural search type to a singular search type
 *
 * @example
 * ```js
 * pluralToSingularSearchType('articles'); // => 'ARTICLE'
 * pluralToSingularSearchType(['articles', 'products']); // => 'ARTICLE,PRODUCT'
 * ```
 */
function pluralToSingularSearchType(
  type:
    | NormalizedPredictiveSearchResults[number]['type']
    | Array<NormalizedPredictiveSearchResults[number]['type']>,
) {
  const plural = {
    articles: 'ARTICLE',
    collections: 'COLLECTION',
    pages: 'PAGE',
    products: 'PRODUCT',
    queries: 'QUERY',
  };

  if (typeof type === 'string') {
    return plural[type];
  }

  return type.map((t) => plural[t]).join(',');
}
