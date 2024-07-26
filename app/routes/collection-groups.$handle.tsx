import { useLoaderData, Link } from '@remix-run/react';
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Pagination, getPaginationVariables, Image } from '@shopify/hydrogen';
import type { CollectionFragment, CollectionGroupByHandleQuery } from 'storefrontapi.generated';
import { MetaobjectField } from '@shopify/hydrogen/storefront-api-types';

export async function loader({ request, params, context }: LoaderFunctionArgs) {
    const { handle } = params;
    const { storefront } = context;
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 8,
    });

    if (!handle) {
        return redirect('/collections');
    }

    const collectionGroup: CollectionGroupByHandleQuery = await storefront.query(COLLECTION_GROUP_QUERY, {
        variables: { collectionGroupHandle: handle, ...paginationVariables },
    });

    if (!collectionGroup.metaobject) {
        throw new Response(`Collection Group ${handle} not found`, {
            status: 404,
        });
    }

    const collectionsIndex = collectionGroup.metaobject.fields.findIndex((field) => field.key === "collections")
    if (collectionsIndex == -1 || collectionGroup.metaobject.fields[collectionsIndex].references == undefined) {
        throw new Response(`Collection Group ${handle} not found`, {
            status: 404,
        })
    }

    return json({ collections: collectionGroup.metaobject.fields[collectionsIndex].references, collectionGroup });
}

export default function Collections() {
    const { collectionGroup, collections } = useLoaderData<typeof loader>();




    return (
        <div className="collections">
            <h1>Collections</h1>
            <Pagination connection={collections}>
                {({ nodes, isLoading, PreviousLink, NextLink }) => (
                    <div>
                        <PreviousLink>
                            {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                        </PreviousLink>
                        <CollectionsGrid collections={nodes} />
                        <NextLink>
                            {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                        </NextLink>
                    </div>
                )}
            </Pagination>
        </div>
    );
}

function CollectionsGrid({ collections }: { collections: CollectionFragment[] }) {
    return (
        <div className="collections-grid">
            {collections.map((collection, index) => (
                <CollectionItem
                    key={collection.id}
                    collection={collection}
                    index={index}
                />
            ))}
        </div>
    );
}

function CollectionItem({
    collection,
    index,
}: {
    collection: CollectionFragment;
    index: number;
}) {
    return (
        <Link
            className="collection-item"
            key={collection.id}
            to={`/collections/${collection.handle}`}
            prefetch="intent"
        >
            {collection?.image && (
                <Image
                    alt={collection.image.altText || collection.title}
                    aspectRatio="1/1"
                    data={collection.image}
                    loading={index < 3 ? 'eager' : undefined}
                />
            )}
            <h5>{collection.title}</h5>
        </Link>
    );
}


const PRODUCT_PREVIEW_FRAGMENT = `#graphql
    fragment ProductPreview on Product {
        featuredImage {
          url
          altText
          id
        }
        title
        seo {
          description
          title
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
    }
`

const COLLECTION_PREVIEW_FRAGMENT = `#graphql
    fragment CollectionPreview on Collection {
        id
        handle
        image {
          url
          altText
          id
        }
        description(truncateAt: 30)
        products(first: 3) {
          nodes {
           ...ProductPreview
          }
        }
        image {
          url
          altText
          id
        }
      }
      ${PRODUCT_PREVIEW_FRAGMENT}
`;

const COLLECTION_GROUP_QUERY = `#graphql

  query CollectionGroupByHandle(
    $collectionGroupHandle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language, country: $country) {

    metaobject(handle: {handle: $collectionGroupHandle, type: "collection_group"}) {
        id
        fields {
            value
            key
            references(
                first: $first
                last: $last
                before: $startCursor
                after: $endCursor
            ) {
                pageInfo {
                    endCursor
                    hasNextPage
                    hasPreviousPage
                    startCursor
                }
                nodes {
                    ... on Collection {
                        ...CollectionPreview
                    }   
                }
            }
        }
    }
    
}
${COLLECTION_PREVIEW_FRAGMENT}
` as const;
