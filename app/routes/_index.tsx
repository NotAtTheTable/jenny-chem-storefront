import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link, type MetaFunction, useNavigate } from '@remix-run/react';
import { Suspense } from 'react';
import type {
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import ProductCard from '~/components/product/ProductCard';
import ArrowButton from '~/components/foundational/ArrowButton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import DashDivider from '~/components/foundational/DashDivider';

export const meta: MetaFunction = () => {
  return [{ title: 'JENNYCHEM | Home' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({ recommendedProducts });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Hero
        title="Outdoor Surface Cleaners"
        subtitle='Giving your vehicle a showroom look without 
        damaging or effecting its paintwork, while 
        keeping it’s gloss finish.'
        ctaOnClick={() => { return 'b' }}
        ctaText='Shop Collection'
        backgroundImage='https://placehold.co/1600x500'
      />
      <BestSellingProducts products={data.recommendedProducts} />
    </div>
  );
}

function NavigateToProductPageButton({ handle }: { handle: string }) {
  const navigate = useNavigate();
  return <ArrowButton label="VIEW ALL SIZES" onClick={() => navigate(`/products/${handle}`)} />
}

function Hero({
  title,
  subtitle,
  ctaText,
  ctaOnClick,
  backgroundImage
}: Readonly<{
  title: string,
  subtitle: string,
  ctaText: string,
  ctaOnClick: () => void,
  backgroundImage: string
}>) {
  return <div
    className="relative bg-cover bg-center flex items-center justify-center"
    style={{ backgroundImage: `url(${backgroundImage})`, height: '500px' }}
  >
    <div className="relative z-10 text-center text-white p-8 max-w-2xl">
      <h1 className="text-5xl font-bold mb-4">{title}</h1>
      <p className="text-xl mb-8">{subtitle}</p>
      <ArrowButton label={ctaText} onClick={ctaOnClick} />
    </div>
  </div>
}

function BestSellingProducts({
  products,
}: Readonly<{
  products: Promise<RecommendedProductsQuery>;
}>) {
  return (
    <div className="flex flex-col items-center">
      <h2 className='text-center text-6xl font-display'>Our Best Sellers</h2>
      <DashDivider />
      <Suspense fallback={<div>Loading...</div>}>
        <Carousel opts={{
          align: "start",
          loop: true,
        }}
          className="w-full max-w-5xl my-6"
        >
          <CarouselContent className="-ml-2">
            <Await resolve={products}>
              {({ products }) => (
                <>
                  {products.nodes.map((product) => (
                    <CarouselItem key={product.id} className="pl-2 md:basis-1/3 lg:basis-1/5">
                      <ProductCard
                        imageData={product.images.nodes[0] as StorefrontAPI.Image}
                        title={product.title}
                        handle={product.handle}
                        ActionElement={NavigateToProductPageButton}
                      />
                    </CarouselItem>
                  ))}
                </>
              )}
            </Await>
          </CarouselContent>
          <CarouselNext style={{ top: "40%", right: "-4rem" }} />
          <CarouselPrevious style={{ top: "40%", left: "-4.5rem" }} />
        </Carousel>
      </Suspense>
      <br />
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;
