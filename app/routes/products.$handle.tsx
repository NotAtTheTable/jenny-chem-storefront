import { Suspense, useEffect, useRef, useState } from 'react';
import { defer, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import {
  Await,
  Link,
  useLoaderData,
  type MetaFunction,
  type FetcherWithComponents,
} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantsQuery,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {
  Image,
  Money,
  VariantSelector,
  type VariantOption,
  getSelectedProductOptions,
  CartForm,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  Product,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import { getVariantUrl } from '~/lib/variants';
import DashDivider from '~/components/foundational/DashDivider';
import Select, { SelectProps } from '~/components/foundational/Select';
import { ArrowButton, Button } from '~/components/foundational/ArrowButton';
import TrustProductMini from '~/components/trustpilot/TrustPilotProductWidget';
import { Loader } from '~/components/ui/Loading/loading';
import { CircleChevronLeft, CircleChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ProductImages } from '~/components/product/ProductImages';
import { ProductPrice } from '~/components/product/ProductPrice';
import { QuantityInput } from '~/components/product/ProductQuantityInput';
import { ProductTabs } from '~/components/product/ProductTabs';
import { ProductOptions } from '~/components/product/ProductOptions';
import { ProductForm } from '~/components/product/ProductForm';
import TrustProductReviews from '~/components/trustpilot/TrustPilotProductGalleryWidget';

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  return [{ title: `Hydrogen | ${data?.product.title ?? ''}` }];
};

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;
  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle, selectedOptions },
  });

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({ product, request });
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: { handle },
  });

  return defer({ product, variants });
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const { product, variants } = useLoaderData<typeof loader>();
  const { selectedVariant } = product;
  return (
    <>
      <ProductMain
        selectedVariant={selectedVariant}
        product={product}
        variants={variants}
      />
      <ProductTabs
        product={product}
      />
      <div className='container'>
        <div className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)] mb-10'>
          <TrustProductReviews sku={product.selectedVariant?.sku || ""} />
        </div>
      </div>
    </>
  );
}

function ProductMain({
  selectedVariant,
  product,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Promise<ProductVariantsQuery>;
}) {
  const { title } = product;
  return <div className='bg-cover bg-center' style={{ backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Product_Page_Background.jpg?v=1725392399)' }}>
    <div className='container flex flex-row py-10'>
      <div className='w-1/2'>
        <Suspense
          fallback={
            <ProductImages
              selectedVariant={selectedVariant}
              variants={[]}
              images={{ nodes: [] }}
            />
          }
        >
          <Await
            errorElement="There was a problem loading product variants"
            resolve={variants}
          >
            {(data) => (
              <ProductImages
                selectedVariant={selectedVariant}
                variants={data.product?.variants.nodes || []}
                images={product.images || []}
              />
            )}
          </Await>
        </Suspense>
      </div>
      <div className='w-1/2 py-8'>
        <h1 style={{ letterSpacing: "0.2rem" }} className='font-display text-jc-dark-blue text-7xl break-normal whitespace-normal'>{title}</h1>
        <div className='w-16'><DashDivider /></div>
        {selectedVariant?.sku && <div className='mt-6 mb-3'><TrustProductMini sku={selectedVariant.sku} /></div>}
        {product.shortDescription?.value && <div className='text-jc-dark-blue'>{product.shortDescription.value}</div>}
        <Suspense
          fallback={
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={[]}
            />
          }
        >
          <Await
            errorElement="There was a problem loading product variants"
            resolve={variants}
          >
            {(data) => (
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={data.product?.variants.nodes || []}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  </div>
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const MEDIA_IMAGE_FRAGMENT = `#graphql
  fragment MediaImage on MediaImage {
    id
    image {
      id
      url
      altText
      width
      height
    }
  }
` as const;

const VIDEO_FRAGMENT = `#graphql
  fragment Video on Video {
    id
    alt
    previewImage {
      url
    }
    sources {
      url
      mimeType
    }
  }
` as const;



const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    images(first: 20) {
      nodes {
          __typename
          id
          url
          altText
          width
          height
      }
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
    tags
    collections(first: 5) {
      nodes {
        id
      }
    }
    faqs: metafield(namespace: "custom", key: "faqs") {
      value
    }
    howToSteps: metafield(namespace: "custom", key: "howtosteps") {
      value
    }
    howToVideoUrl: metafield(namespace: "custom", key: "how_to_video_url") {
      value
    }
    shortDescription: metafield(namespace: "custom", key: "short_description") {
      value
    }
    overviewMedia: metafield(namespace: "custom", key: "overview_media") {
      references(first: 5) {
        nodes {
          __typename
          ...MediaImage
          ...Video
        }
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
  ${MEDIA_IMAGE_FRAGMENT}
  ${VIDEO_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
