import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image } from '@shopify/hydrogen';
import DashDivider from '~/components/foundational/DashDivider';

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

  // return (
  //   <div className="article">
  //     <h1>
  //       {title}
  //       <span>
  //         {publishedDate} &middot; {author?.name}
  //       </span>
  //     </h1>

  //     {image && <Image data={image} sizes="90vw" loading="eager" />}
  //     <div
  //       dangerouslySetInnerHTML={{__html: contentHtml}}
  //       className="article"
  //     />
  //   </div>
  // );

  return (
    <div>
      <div className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${image?.url})`, height: 'fit-content' }}>
        <div style={{ background: 'linear-gradient(to right, rgba(11,21,57,0.75), rgba(11,21,57,0) )' }} className="absolute w-full inset-0 " />
        <div className='container relative pt-14 z-10 text-white'>
          <h1 className='w-[50%] font-display text-8xl tracking-large'>{title}</h1>
          <div className='w-16'><DashDivider className='-mt-3 h-[3px]' /></div>
          <div style={{ fontSize: "18px" }} className='text'>{publishedDate} / {author?.name}</div>
          <div>Share</div>
          <br />
          <div className='pb-6'><Link to={`/`}>Home</Link>&nbsp;&gt;&nbsp;<Link to={`/blogs/news`}>Blog</Link>&nbsp;&gt;&nbsp;{title}</div>
        </div>
      </div>
      <div className='container'>
        <DashDivider className="w-[100%] mt-4 mb-2 h-[1px] bg-opacity-50" />
        <div
          className='article'
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <DashDivider className="w-[100%] mt-4 mb-2 h-[1px] bg-opacity-50" />
      </div>
    </div>
  )
}

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
    }
  }
` as const;
