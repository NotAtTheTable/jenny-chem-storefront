import { useLoaderData, Link, useNavigate } from '@remix-run/react';
import { json, redirect, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Pagination, getPaginationVariables, Image } from '@shopify/hydrogen';
import type { CollectionGroupByHandleQuery, CollectionPreviewFragment } from 'storefrontapi.generated';
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import { PageHeader } from '~/components/foundational/PageHeader';
import { ArrowButton, DownArrowButton } from '~/components/foundational/ArrowButton';
import DashDivider from '~/components/foundational/DashDivider';
import ProductCard from '~/components/card/ProductCard';

export async function loader({ request, params, context }: LoaderFunctionArgs) {
    const { handle } = params;
    const { storefront } = context;
    const paginationVariables = getPaginationVariables(request, {
        pageBy: 4,
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
                    headingTextClassName='w-[30%] font-display text-8xl tracking-large'
                    subTextNode={<>
                        <div style={{ fontSize: "18px" }} className='text w-[35%]'>{description}</div>
                        <br />
                        <div className='pb-6'><Link to={`/`}>Home</Link>&nbsp;&gt;&nbsp;{title}</div>
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
                                    <div key={node.id}>
                                        <CollectionSummary
                                            {...node}
                                        />
                                        <DashDivider className="w-[100%] mt-3 h-[1px] bg-opacity-50 mb-3" />
                                    </div>
                                ))
                            }
                            <div className='flex justify-center mb-12'>
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
    const navigate = useNavigate();
    return <div className='flex flex-row justify-center'>
        <div className="p-5 relative bg-cover bg-center w-[457px] mr-[6px] flex flex-col justify-end"
            style={{ backgroundImage: `url(${props.image?.url})` }}>
            <div style={{ background: 'linear-gradient(to top, rgba(11,21,57,0.75), rgba(11,21,57,0) )' }} className="absolute w-full inset-0 " />
            <div className='relative pt-14 z-10 text-white'>
                <h1 className='w-[50%] font-display text-6xl tracking-large'>{props.title}</h1>
                <div className='w-16'><DashDivider className='-mt-3 h-[3px]' /></div>
                {props.description}
                <div className="mt-3 w-40"><ArrowButton label="Shop Now" onClick={() => navigate(`/collections/${props.handle}`)} /></div>
            </div>
        </div>
        {props.products.nodes.map((product) => {
            return (
                <div key={product.handle}>
                    <ProductCard
                        imageData={product.images.nodes[0] as StorefrontAPI.Image}
                        title={product.title}
                        price={product.priceRange.minVariantPrice as StorefrontAPI.MoneyV2}
                        handle={product.handle}
                        ActionElement={NavigateToProductPageButton}
                    />
                </div>
            )
        })}
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
        description(truncateAt: 150)
        products(first: 3) {
          nodes {
           ...ProductPreview
          }
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

