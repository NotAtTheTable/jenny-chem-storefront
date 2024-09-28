import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, Link, type MetaFunction, useNavigate } from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
} from '@shopify/hydrogen';
import type { CollectionGroupLightQuery, ProductCardPreviewFragment } from 'storefrontapi.generated';
import { PageHeader } from '~/components/foundational/PageHeader';
import ProductCard from '~/components/card/ProductCard';
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import DashDivider from '~/components/foundational/DashDivider';
import { ArrowButton, DownArrowButton } from '~/components/foundational/ArrowButton';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.collection.title ?? ''} Collection` }];
};

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  if (!handle) {
    return redirect('/collections');
  }

  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle, ...paginationVariables },
  });

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  const collectionGroups: CollectionGroupLightQuery = await storefront.query(COLLECTION_GROUP_LIGHT_QUERY)
  // Is this collection part of any collectionGroups for breadcrumb 
  const metaObject = collectionGroups.metaobjects.nodes.find((node) => {
    return node.fields.some((field) => {
      return field.value?.includes(collection.id)
    })
  })

  const collectionGroup = {
    title: metaObject?.fields.find(field => field.key === "title")?.value,
    handle: metaObject?.handle
  }


  return json({ collection, collectionGroup });
}

export default function Collection() {
  const { collection, collectionGroup } = useLoaderData<typeof loader>();

  return (
    <div className="collection">
      <div className='bg-jc-dark-blue'>
        <PageHeader
          gradientCurtain={false}
          imageUrl={collection.image?.url}
          title={collection.title || ""}
          headingTextClassName='w-[40%] font-display text-8xl tracking-large'
          subTextNode={<>
            <div style={{ fontSize: "18px" }} className='text w-[35%]'>{collection.description}</div>
            <br />
            <div className='pb-6'>
              <Link to={`/`}>Home</Link>
              {collectionGroup.title && <>&nbsp;&gt;&nbsp;<Link to={`/collection-groups/${collectionGroup.handle}`}>{collectionGroup.title}</Link></>}
              &nbsp;&gt;&nbsp;{collection.title}
            </div>
          </>}
        />
      </div>
      <div className='container center'>
        <DashDivider className="w-[100%] mt-5 h-[1px] bg-opacity-50 mb-3" />
        <Pagination connection={collection.products}>
          {({ nodes, isLoading, NextLink }) => (
            <>
              <ProductsGrid products={nodes} />
              <DashDivider className="w-[100%] mt-5 h-[1px] bg-opacity-50 mb-3" />
              <div className='flex justify-center mb-12'>
                <NextLink><DownArrowButton label="View More" onClick={() => { }} /></NextLink>
              </div>
            </>
          )}
        </Pagination>
      </div>

    </div>
  );
}

function ProductsGrid({ products }: { products: ProductCardPreviewFragment[] }) {
  const navigate = useNavigate();
  return (
    <div className='relative m-auto w-max grid xs:grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5'>
      {products.map((product) => {
        return (
          <div key={product.id}>
            <ProductCard
              id={product.id}
              imageData={product.images.nodes[0] as StorefrontAPI.Image}
              title={product.title}
              price={product.priceRange.minVariantPrice as StorefrontAPI.MoneyV2}
              handle={product.handle}
              ActionElement={() => <ArrowButton label="VIEW ALL SIZES" onClick={() => navigate(`/products/${product.handle}`)} />}
            />

          </div>
        );
      })}
    </div>
  );
}

export const PRODUCT_PREVIEW_FRAGMENT = `#graphql
    fragment MoneyProductItem on MoneyV2 {
      amount
      currencyCode
    }
    fragment ProductCardPreview on Product {
        images(first: 1) {
            nodes {
                id
                url
                altText
                width
                height
            }
        }
        id
        handle
        title
        seo {
          description
          title
        }
        priceRange {
          minVariantPrice {
            ...MoneyProductItem
          }
        }
    }
`

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description(truncateAt: 150)
      image {
          url
          altText
          id
        }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductCardPreview
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
  ${PRODUCT_PREVIEW_FRAGMENT}
` as const;

const COLLECTION_GROUP_LIGHT_QUERY = `#graphql

  query CollectionGroupLight(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    metaobjects(type: "collection_group", first:250) {
      nodes {
        id
        handle
        updatedAt
        type
        fields {
          value
          key
        }
      }
    }
}
` as const;
