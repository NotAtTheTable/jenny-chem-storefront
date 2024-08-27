import { Suspense, useEffect, useState } from 'react';
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
  const { title, descriptionHtml } = product;
  return <div className='bg-jc-light-blue bg-opacity-30'>
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
      <div className='w-1/2 py-16'>
        <h1 style={{ letterSpacing: "0.2rem" }} className='font-display text-jc-dark-blue text-7xl break-normal whitespace-normal'>{title}</h1>
        <div className='w-16'><DashDivider /></div>
        <div className='mt-6 mb-3'><TrustProductMini sku={selectedVariant?.sku || ""} /></div>
        <div className='text-jc-dark-blue' dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
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

function ProductTabs({
  product
}: { product: ProductFragment; }) {
  return (
    <Tabs defaultValue="overview" className='container'>
      <TabsList className="flex w-full overflow-x-auto overflow-y-hidden">
        <TabsTrigger value="overview" className="min-w-[200px] flex-shrink-0 px-10">PRODUCT OVERVIEW</TabsTrigger>
        <TabsTrigger value="faq" className="min-w-[100px] flex-shrink-0 px-10">FAQ's</TabsTrigger>
        <TabsTrigger value="reviews" className="min-w-[100px] flex-shrink-0 px-10">REVIEWS</TabsTrigger>
        <TabsTrigger value="shipping" className="min-w-[200px] flex-shrink-0 px-10">SHIPPING & RETURNS</TabsTrigger>
        <TabsTrigger value="related" className="min-w-[200px] flex-shrink-0 px-10">RELATED PRODUCTS</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]' >
      </TabsContent>
      <TabsContent value="faq" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
      </TabsContent>
      <TabsContent value="reviews" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
      </TabsContent>
      <TabsContent value="shipping" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
      </TabsContent>
      <TabsContent value="related" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
      </TabsContent>
    </Tabs>
  )
}

function ProductImages({ selectedVariant, variants, images }: {
  selectedVariant: ProductFragment['selectedVariant'],
  variants: Array<ProductVariantFragment>,
  images: ProductFragment["images"];
}) {

  const getImageIndex = (selectedImage: ProductVariantFragment["image"]) => {
    return images.nodes.findIndex(image => selectedImage?.id == image.id)
  }

  const [largeImageIndex, setLargeImageIndex] = useState(getImageIndex(selectedVariant?.image))


  useEffect(() => {
    if (!selectedVariant?.image) {
      return
    }

    setLargeImageIndex(getImageIndex(selectedVariant.image))
  }, [selectedVariant])

  const handleNavigationClick = (indexChange: number) => {
    const newIndex = (largeImageIndex + indexChange + images.nodes.length) % images.nodes.length;
    setLargeImageIndex(newIndex);
  }

  const selectedImage = images.nodes[largeImageIndex];

  if (!selectedImage) {
    return <div className="h-full w-auto"></div>;
  }
  return (
    <div className="flex flex-row">
      <div className="h-[550px] flex flex-col h-full" style={{ maxHeight: '100%' }}>
        <div className="flex flex-col space-y-" style={{ maxHeight: '100%' }}>
          {images.nodes.length > 1 && images.nodes.map((image, index) => (
            image && (
              <button onClick={() => setLargeImageIndex(getImageIndex(image))} key={image.id} className={`h-auto w-auto rounded ${largeImageIndex === index ? 'border-2' : 'border'} border-${largeImageIndex === index ? "jc-light-blue" : "jc-light-blue-100"}`}>
                <Image
                  alt={image.altText || 'Product Image'}
                  aspectRatio="1/1"
                  data={image}
                  width={70}
                  height={70}
                  sizes="70px"
                />
              </button>
            )
          ))}
        </div>
      </div>
      <div className="h-[550px] w-auto px-10 mx-8 relative flex items-center justify-center">
        {images.nodes.length > 1 && <>
          <button onClick={() => handleNavigationClick(-1)} className='absolute left-[40px] top-1/2 transform -translate-y-1/2'>
            <CircleChevronLeft className={'text-jc-light-blue'} size={40} strokeWidth={1} />
          </button>
          <button onClick={() => handleNavigationClick(1)} className='absolute right-[40px] top-1/2 transform -translate-y-1/2'>
            <CircleChevronRight className={'text-jc-light-blue'} size={40} strokeWidth={1} />
          </button>
        </>
        }
        <div className="h-full w-full flex items-center justify-center">
          <Image
            alt={selectedImage.altText || 'Product Image'}
            aspectRatio="1/1"
            data={selectedImage}
            key={selectedImage.id}
            sizes="(min-width: 45em) 50vw, 100vw"
            className="max-h-full max-w-full object-contain"
          />
        </div>

      </div>
    </div>
  );
}

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <div>
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <br />
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money style={{ letterSpacing: "0.12rem" }} className='font-display text-jc-dark-blue text-5xl -mb-1' data={selectedVariant?.price} />
      )}
    </div>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {

  // Store the quantity of products in the form
  const [quantity, setQuantity] = useState<number>(1);

  // Remove the product.options which have name "title" so we don't get default
  const filteredOptions = product.options.filter(option => option.name.toLowerCase() !== 'title');

  return (
    <div>
      <VariantSelector
        handle={product.handle}
        options={filteredOptions}
        variants={variants}
      >
        {({ option }) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <QuantityInput
        value={`${quantity}`}
        onChange={(value) => { setQuantity(Number(value)) }}
      />
      <div className='flex flex-row items-center'>
        <div className='flex items-center'>
          <ProductPrice
            selectedVariant={selectedVariant}
          />
        </div>
        <div className='w-[1px] mx-6 self-stretch bg-jc-light-blue' />
        <p>KLARNA</p>
      </div>
      <div className='my-6 w-56'>
        {
          !selectedVariant?.availableForSale ?
            <div>
              <Button
                disabled={true}
                label='Sold Out'
              />
            </div>

            :
            <AddToCartButton
              disabled={!selectedVariant}
              onClick={() => {
                window.location.href = window.location.href + '#cart-aside';
              }}
              lines={
                selectedVariant
                  ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: quantity,
                    },
                  ]
                  : []
              }
              label={'Add to basket'}
            />
        }
      </div>
    </div>
  );
}

function ProductOptions({ option }: { option: VariantOption }) {
  return (
    <div className="product-options my-4" key={option.name}>
      <h3 className='font-display tracking-wide text-2xl text-jc-dark-blue mb-2'>{option.name}</h3>
      <div className="product-options-grid">
        {option.values.map(({ value, isAvailable, isActive, to }) => {
          return (
            <Link
              className={`
                border-[1.5px]
                border-jc-light-blue
                rounded
                font-display
                tracking-wide
                px-4
                py-1
                leading-none
                text-lg
                ${isActive ? "text-white bg-jc-dark-blue" : "text-jc-dark-blue"}
                ${isAvailable ? "text-opacity-100" : "text-opacity-30"}
              `}
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                boxShadow: isActive ? "0 0 6px rgba(23,34,93,0.35)" : 'unset',
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function QuantityInput({ value, onChange }: { value: SelectProps['value'], onChange: SelectProps['onChange'] }) {
  return (
    <div className='flex items-center my-6'>
      <label className='font-display tracking-wide text-2xl text-jc-dark-blue mr-4'>Quantity:</label>
      <Select
        className='w-14 text-jc-dark-blue text-xl font-display leading-none'
        options={[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3', label: '3' },
          { value: '4', label: '4' },
          { value: '5', label: '5' },
          { value: '6', label: '6' },
          { value: '7', label: '7' },
          { value: '8', label: '8' },
          { value: '9', label: '9' },
          { value: '10', label: '10' }
        ]}
        value={value} onChange={onChange} />
    </div>
  )
}

function AddToCartButton({
  analytics,
  disabled,
  lines,
  onClick,
  label,
}: {
  analytics?: unknown;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
  label: string;
}) {
  return (
    <div>
      <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
        {(fetcher: FetcherWithComponents<any>) => (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <ArrowButton
              type="submit"
              onClick={onClick}
              disabled={disabled ?? fetcher.state !== 'idle'}
              label={label}
            />
          </>
        )}
      </CartForm>
    </div>
  )
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
  }
  ${PRODUCT_VARIANT_FRAGMENT}
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
