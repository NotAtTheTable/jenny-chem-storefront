import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, useNavigate, type MetaFunction } from '@remix-run/react';
import { Pagination, getPaginationVariables } from '@shopify/hydrogen';
import DashDivider from '~/components/foundational/DashDivider';
import { ArticleCarousel } from '~/components/blog/ArticleCarousel';
import { useViewport } from '~/hooks/useViewport';
import { Chip } from '~/components/foundational/Chip';
import { ArticleCardFragment, BlogArticlesQuery } from 'storefrontapi.generated';
import { Viewport } from './_index';
import { Suspense, useState } from 'react';
import { ArticleCard } from '~/components/card/ArticleCard';
import { ChevronDownIcon, ChevronUpIcon, CircleChevronDownIcon, CircleChevronUpIcon } from 'lucide-react';
import { ArrowButton, DownArrowButton } from '~/components/foundational/ArrowButton';
import Heading from '~/components/foundational/Heading';

// TODO: Populate the header by using blog information
export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `JennyChem | blog` }];
};

export async function loader({
  request,
  params,
  context: { storefront },
}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request);

  const url = new URL(request.url);
  const reverse = url.searchParams.get("reverse");
  const tags = url.searchParams.get("tags");
  // TODO : Fetch data based on the tags

  if (!params.blogHandle) {
    throw new Response(`blog not found`, { status: 404 });
  }

  const articles = await storefront.query(BLOG_ARTICLES_QUERY, {
    variables: { ...paginationVariables, reverse: reverse === "true" }
  });

  const recommendedArticles = await storefront.query(RECOMMENDED_BLOG_ARTICLES_QUERY);

  return json({ articles, recommendedArticles });
}

const HeadingSection = () => {
  return (
    <div className='border-b-[0.75px] border-jc-light-blue-100 bg-cover bg-center' style={{ backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Product_Page_Background.jpg?v=1725392399)' }}>
      <div className='container relative py-16 text-jc-dark-blue'>
        <div className='text-center w-full flex flex-col items-center'>
          <Heading level={1} className='font-display text-8xl'><span className='text-jc-light-blue'>TIPS & TRICKS</span><br />WHEN IT COMES TO CLEANING</Heading>
          <div className="max-w-3xl">
            Aut explicabo quasi et omnis necessitatibus sed alias amet a commodi adipisci sit autem tempore qui quaerat eaque. Et eveniet laudantium qui inventore vitae non maxime consequatur eos omnis debitis id sequi soluta. Aut obcaecati aliquam ut tempora voluptatem et cupiditate consectetur non.
          </div>
        </div>
        <div className='absolute left-0 bottom-5'>Home &gt; Blog</div>
      </div>
    </div >
  )
}

const ArticleList = ({ articles }: Readonly<{
  articles: BlogArticlesQuery["articles"]
  viewport?: Viewport;
  mode?: "light" | "dark";
}>) => {

  const [sortByDate, setSortByDate] = useState<"ascending" | "descending">("descending");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSortByChange = (value: "ascending" | "descending"): void => {
    setSortByDate(value)
    navigate(`?reverse=${value === "ascending"}`)
  };

  const handleSelectProperty = (value: string): void => {
    if (selectedProperties.includes(value)) {
      setSelectedProperties(selectedProperties.filter(property => property !== value));
    } else {
      setSelectedProperties([...selectedProperties, value])
    }
  }

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
        {/* {properties.map((property) => (
          <Chip key={property} handleSelect={() => handleSelectProperty(property)} isSelected={selectedProperties.includes(property)} label={property} />
        ))} */}
      </div>

      <Pagination connection={articles}>
        {({ nodes, NextLink, isLoading }) => (
          <>
            <div className='relative grid grid-cols-4 px-6'>
              <div className='absolute right-0 -top-10 flex flex-row gap-2 text-jc-dark-blue font-bold text-sm'>
                <p>Sort by date:</p>
                <button
                  onClick={() => handleSortByChange("descending")}
                >{
                    sortByDate === "ascending" ?
                      <CircleChevronDownIcon className={"text-jc-light-blue"} />
                      :
                      <div className="bg-jc-dark-blue rounded-full h-[21px] w-[21px] flex justify-center items-center">
                        <ChevronDownIcon strokeWidth={3} className={"text-white h-[16px] w-[16px]"} />
                      </div>
                  }</button>
                <button
                  onClick={() => handleSortByChange("ascending")}
                >{
                    sortByDate === "descending" ?
                      <CircleChevronUpIcon className={"text-jc-light-blue"} />
                      :
                      <div className="bg-jc-dark-blue rounded-full h-[21px] w-[21px] flex justify-center items-center">
                        <ChevronUpIcon strokeWidth={3} className={"text-white h-[16px] w-[16px]"} />
                      </div>
                  }</button>
              </div>
              {nodes.map((article: ArticleCardFragment) => (
                <div className='flex justify-center my-3'>
                  <ArticleCard
                    handle={article.handle}
                    title={article.title}
                    publishedAt={new Date(article.publishedAt)}
                    imageUrl={article.image?.url || undefined}
                    onClick={() => { return '' }}
                    className="h-60"
                  />
                </div>
              ))}
            </div>
            <DashDivider className="w-[100%] mt-5 h-[1px] bg-opacity-50 mb-3" />
            <div className='flex justify-center'>
              <NextLink><DownArrowButton label="View More" onClick={() => { }} /></NextLink>
            </div>
          </>
        )}
      </Pagination>
    </>
  )
}

export default function Blog() {

  const { articles, recommendedArticles } = useLoaderData<typeof loader>();

  const isMobile = useViewport();
  return (
    <div className="blog">
      <HeadingSection />
      <div className='container py-16'>
        <Heading className="font-display text-jc-dark-blue text-6xl text-center" level={1}>POPULAR ARTICLES</Heading>
        <ArticleCarousel mode={"light"} articles={recommendedArticles.articles} viewport={isMobile ? "mobile" : "desktop"} />
        <DashDivider className="w-[100%] mt-5 h-[1px] bg-opacity-50 -mb-3" />
        <ArticleList articles={articles.articles} />
      </div>
    </div>
  );
}



const ARTICLE_CARD_FRAGMENT = `#graphql
fragment ArticleCard on Article {
        id
        handle
        title
        excerpt
        publishedAt
        image {
          id
          url
        }
        seo {
          title
          description
        }
      }
`;

const BLOG_ARTICLES_QUERY = `#graphql
  query BlogArticles(
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $reverse: Boolean
  ) {

      articles(first: $first, last: $last, before: $startCursor, after: $endCursor, query: "blog:handle:news", sortKey:PUBLISHED_AT, reverse: $reverse) {
        nodes {
          ...ArticleCard
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
          startCursor
        }
      }
    }
  
  ${ARTICLE_CARD_FRAGMENT}
`;

export const RECOMMENDED_BLOG_ARTICLES_QUERY = `#graphql
  query RecommendedBlogArticles 
  {
      articles(first:20, query: "blog:handle:news") {
        nodes {
          ...ArticleCard
        }
      }
    }
  
  ${ARTICLE_CARD_FRAGMENT}
`;
