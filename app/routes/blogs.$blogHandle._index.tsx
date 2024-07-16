import { defer, json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image, Pagination, getPaginationVariables } from '@shopify/hydrogen';
import DashDivider from '~/components/foundational/DashDivider';
import { ArticleCarousel } from '~/components/blog/ArticleCarousel';
import { useViewport } from '~/hooks/useViewport';

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

export default function Blog() {
  const isMobile = useViewport();
  const { blog } = useLoaderData<typeof loader>();
  return (
    <div className="blog">
      <HeadingSection />
      <div className='container py-10'>
        <h1 className="font-display text-jc-dark-blue text-6xl text-center">POPULAR ARTICLES</h1>
        <DashDivider className="-mt-1 mb-4 h-[2px]" />
        <div className='container'>
          <ArticleCarousel mode={"light"} blog={blog as any} viewport={isMobile ? "mobile" : "desktop"} />
        </div>
        <DashDivider className="w-[110%] mt-5 h-[1px] bg-opacity-50" />
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