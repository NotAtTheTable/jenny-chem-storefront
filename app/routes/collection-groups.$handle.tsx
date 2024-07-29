import { useLoaderData, Link, useNavigate } from '@remix-run/react';
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Pagination, getPaginationVariables, Image } from '@shopify/hydrogen';
import type { CollectionFragment, CollectionGroupByHandleQuery, CollectionPreviewFragment } from 'storefrontapi.generated';
import { MetaobjectField } from '@shopify/hydrogen/storefront-api-types';
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import { PageHeader } from '~/components/foundational/PageHeader';
import { ArrowButton, DownArrowButton } from '~/components/foundational/ArrowButton';
import DashDivider from '~/components/foundational/DashDivider';
import ProductCard from '~/components/card/ProductCard';

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
    if (collectionsIndex == -1 || !collectionGroup.metaobject.fields[collectionsIndex].references) {
        throw new Response(`Collection Group ${handle} not found`, {
            status: 404,
        })
    }

    const coverImage = collectionGroup.metaobject?.fields.find((field) => field.key === "cover_image")?.reference?.image;
    const title = collectionGroup.metaobject?.fields.find((field) => field.key === "title")?.value;
    const description = collectionGroup.metaobject?.fields.find((field) => field.key === "description")?.value;

    return json({ collections: collectionGroup.metaobject.fields[collectionsIndex].references, coverImage, title, description });
}

export default function Collections() {
    const { collections, coverImage, title, description } = useLoaderData<typeof loader>();


    return (
        <div className="collections">
            <div className='bg-jc-dark-blue'>
                <PageHeader
                    gradientCurtain={false}
                    imageUrl={coverImage?.url}
                    title={title || ""}
                    headingTextNode={<h1 className='w-[20%] font-display text-8xl tracking-large'>{title}</h1>}
                    subTextNode={<>
                        <div style={{ fontSize: "18px" }} className='text w-[35%]'>{description}</div>
                        <br />
                        <div className='pb-6'><Link to={`/`}>Home</Link>&nbsp;&gt;&nbsp;<Link to={`/blogs/news`}>Blog</Link>&nbsp;&gt;&nbsp;{title}</div>
                    </>}
                />
            </div>
            {collections &&
                <Pagination connection={collections}>
                    {({ nodes, isLoading, NextLink }) => (
                        <div className='container'>
                            <DashDivider className="w-[100%] mt-5 h-[1px] bg-opacity-50 mb-3" />
                            {
                                nodes.map((node) => (
                                    <>
                                        <CollectionSummary
                                            {...node}
                                        />
                                        <DashDivider className="w-[100%] mt-3 h-[1px] bg-opacity-50 mb-3" />
                                    </>
                                ))
                            }
                            <div className='flex justify-center'>
                                <NextLink><DownArrowButton label="View More" onClick={() => { }} /></NextLink>
                            </div>
                        </div>
                    )}
                </Pagination>
            }
        </div>
    );
}

const CollectionSummary = (props: CollectionPreviewFragment) => {
    return <div className='flex flex-row justify-center'>
        {props?.image &&
            <Image
                className='mr-[6px]'
                alt={props.image?.altText || props?.title}
                aspectRatio="1/1"
                data={props.image}
                loading={'eager'}
                sizes="(min-width: 45em) 400px, 100vw"
            />
        }
        <img className='mr-[6px]' src='https://placehold.co/495x457' />
        {props.products.nodes.map((product) => (
            <div key={product.handle}>
                <ProductCard
                    imageData={product.images.nodes[0] as StorefrontAPI.Image}
                    title={product.title}
                    handle={product.handle}
                    ActionElement={NavigateToProductPageButton}
                />
            </div>
        ))}
    </div>
}

function NavigateToProductPageButton({ handle }: { handle: string }) {
    const navigate = useNavigate();
    return <ArrowButton label="VIEW ALL SIZES" onClick={() => navigate(`/products/${handle}`)} />
}

const PRODUCT_PREVIEW_FRAGMENT = `#graphql
    fragment ProductPreview on Product {
        images(first: 1) {
            nodes {
                id
                url
                altText
                width
                height
            }
        }
        handle
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
        title
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
            reference {
                ... on MediaImage {
                    image {
                        id
                        url
                        altText
                    }
                }
            }
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

