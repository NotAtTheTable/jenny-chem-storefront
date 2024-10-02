import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import DashDivider from '~/components/foundational/DashDivider';
import { PageHeader } from '~/components/foundational/PageHeader';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.article.title ?? ''} article` }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const { blogHandle, articleHandle } = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', { status: 404 });
  }

  const { blog } = await context.storefront.query(ARTICLE_QUERY, {
    variables: { blogHandle, articleHandle },
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, { status: 404 });
  }

  const article = blog.articleByHandle;

  return json({ article });
}

export default function Article() {
  const { article } = useLoaderData<typeof loader>();
  const { title, image, contentHtml, author } = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (<>
    <div className='desktop-component'>
      <PageHeader
        title={title}
        headingTextClassName='!text-white w-[50%] font-display text-8xl tracking-large'
        imageUrl={image?.url}
        subTextNode={
          <>
            <div style={{ fontSize: "18px" }} className='text'>{publishedDate} / {author?.name}</div>
            <div>Share</div>
            <br />
            <div className='pb-6'><Link to={`/`}>Home</Link>&nbsp;&gt;&nbsp;<Link to={`/blogs/news`}>Blog</Link>&nbsp;&gt;&nbsp;{title}</div>
          </>
        }
      />
      <div className='container'>
        <DashDivider className="w-[100%] mt-4 mb-2 h-[1px] bg-opacity-50" />
        <div
          className='article'
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <DashDivider className="w-[100%] mt-4 mb-2 h-[1px] bg-opacity-50" />
      </div>
    </div>

    <div className='mobile-component'>
      <div style={{ backgroundImage: `url(${image?.url})`, height: 'fit-content' }}
        className='mobile-component shadow px-4 py-8 relative bg-cover bg-center bg-jc-dark-blue border-b-[0.75px] border-jc-light-blue-100 text-center text-white'>
        <div className="absolute w-full inset-0 bg-jc-dark-blue bg-opacity-[55%]" />
        <div className='relative z-10'>
          <h1 className='font-display text-6xl leading-[1] '>{title}</h1>
          <DashDivider />
          <div style={{ fontSize: "18px" }} className='mt-4'>{publishedDate} / {author?.name}</div>
          <div>Share</div>
          <br />
          <div className='text-sm'><Link to={`/`}>Home</Link>&nbsp;&gt;&nbsp;<Link to={`/blogs/news`}>Blog</Link>&nbsp;&gt;&nbsp;{title}</div>
        </div>
      </div>
      <div className='px-4 py-8'>
        <div
          className='mobile-article'
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <DashDivider className="w-[100%] mt-4 mb-2 h-[1px] bg-opacity-50" />
      </div>
    </div>
  </>
  )
}

const ARTICLE_FRAGMENT = `#graphql
fragment ArticleContent on Article {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
`;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        ...ArticleContent
      }
    }
  }
  ${ARTICLE_FRAGMENT}
` as const;
