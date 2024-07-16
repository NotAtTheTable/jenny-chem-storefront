import { defer, json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image, Pagination, getPaginationVariables } from '@shopify/hydrogen';
import DashDivider from '~/components/foundational/DashDivider';
import { ArticleCarousel } from '~/components/blog/ArticleCarousel';
import { useViewport } from '~/hooks/useViewport';
import { Chip } from '~/components/foundational/Chip';
import { RecommendedBlogPostsQuery } from 'storefrontapi.generated';
import { Viewport } from './_index';
import { Suspense } from 'react';
import { ArticleCard } from '~/components/card/ArticleCard';

// TODO: Populate the header by using blog information
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | blog` }];
};

export async function loader({
  request,
  params,
  context: { storefront },
}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, { status: 404 });
  }

  const blog = storefront.query(RECOMMENDED_BLOG_POSTS_QUERY, {
  });

  return defer({ blog });
}

const HeadingSection = () => {
  return (
    <div className='bg-jc-light-blue bg-opacity-15'>
      <div className='container relative py-16 text-jc-dark-blue'>
        <div className='text-center w-full flex flex-col items-center'>
          <h1 className="font-display text-jc-light-blue text-8xl">TIPS & TRICKS</h1>
          <h1 className="font-display text-jc-dark-blue text-8xl">WHEN IT COMES TO CLEANING</h1>
          <DashDivider className="-mt-1 mb-2 h-[3px]" />
          <div className="max-w-3xl">
            Aut explicabo quasi et omnis necessitatibus sed alias amet a commodi adipisci sit autem tempore qui quaerat eaque. Et eveniet laudantium qui inventore vitae non maxime consequatur eos omnis debitis id sequi soluta. Aut obcaecati aliquam ut tempora voluptatem et cupiditate consectetur non.
          </div>
        </div>
        <div className='absolute left-0 bottom-5'>Home &gt; Blog</div>
      </div>
    </div>
  )
}

const ArticleList = ({ blog }: Readonly<{
  blog: Promise<RecommendedBlogPostsQuery>
  viewport?: Viewport;
  mode?: "light" | "dark";
}>) => {
  //TODO Break this out into properties in the blog 
  const properties = [
    "valeting",
    "workshop",
    "home",
    "garden",
    "spa",
    "janitorial",
    "equipment"
  ]

  return (
    <>
      <div className='flex flex-row gap-2 py-10 w-full justify-center'>
        {properties.map((property) => (
          <Chip handleSelect={() => { }} isSelected={true} label={property} />
        ))}
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={blog}>
          {({ blog }) => (
            <div className='grid grid-cols-4 gap-5'>
              {blog?.articles.nodes.map((article) => (
                <ArticleCard
                  title={article.title}
                  publishedAt={new Date(article.publishedAt)}
                  imageUrl={article.image?.url || undefined}
                  onClick={() => { return '' }}
                  className="h-60"
                />
              ))}
            </div>
          )}
        </Await>
      </Suspense>

    </>
  )
}

export default function Blog() {
  const isMobile = useViewport();
  const { blog } = useLoaderData<typeof loader>();
  return (
    <div className="blog">
      <HeadingSection />
      <div className='container py-16'>
        <h1 className="font-display text-jc-dark-blue text-6xl text-center">POPULAR ARTICLES</h1>
        <DashDivider className="-mt-1 mb-4 h-[3px]" />

        <ArticleCarousel mode={"light"} blog={blog as any} viewport={isMobile ? "mobile" : "desktop"} />

        <DashDivider className="w-[100%] mt-5 h-[1px] bg-opacity-50 -mb-3" />
        <ArticleList blog={blog as any} />
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const RECOMMENDED_BLOG_POSTS_QUERY = `#graphql
                query RecommendedBlogPosts ($country: CountryCode, $language: LanguageCode)
                @inContext(country: $country, language: $language) {
                  blog(handle: "news") {
                  id
          seo {
                  title
            description
          }
                articles(first: 20) {
                  nodes {
                  id
              title
                image {
                  id
                url
              }
                publishedAt
                excerpt
                seo {
                  title
                description
              }
            }
          }
        }
    }
                `;