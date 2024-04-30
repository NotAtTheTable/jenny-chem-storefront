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
      <BestSellingProducts products={data.recommendedProducts} />
    </div>
  );
}

function NavigateToProductPageButton({ handle }: { handle: string }) {
  const navigate = useNavigate();
  return <ArrowButton label="VIEW ALL SIZES" onClick={() => navigate(`/products/${handle}`)} />
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
