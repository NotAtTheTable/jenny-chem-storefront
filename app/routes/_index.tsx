import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, type MetaFunction, useNavigate } from '@remix-run/react';
import { Suspense, useState } from 'react';
import type {
  RecommendedBlogArticlesQuery,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';
import ProductCard from '~/components/card/ProductCard';
import { ArrowButton } from '~/components/foundational/ArrowButton';
import { Carousel, CarouselBreadcrumbs, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay'
import DashDivider from '~/components/foundational/DashDivider';
import ReactPlayer from 'react-player'

import FacebookIcon from '~/assets/social-icons/facebook.svg'
import YoutubeIcon from '~/assets/social-icons/youtube.svg'
import TiktokIcon from '~/assets/social-icons/tiktok.svg'
import InstagramIcon from '~/assets/social-icons/instagram.svg'

import TrustBox from '~/components/trustpilot/TrustPilotWidget';
import { useViewport } from '~/hooks/useViewport';
import { BlueBubbleBackground } from '~/components/foundational/BlueBubbleBackground';
import { ArticleCarousel } from '~/components/blog/ArticleCarousel';
import { RECOMMENDED_BLOG_ARTICLES_QUERY } from './blogs.$blogHandle._index';
import { Header } from '~/components/Header';
import Heading from '~/components/foundational/Heading';

export type Viewport = 'desktop' | 'mobile';

export const meta: MetaFunction = () => {
  return [{ title: 'JENNYCHEM | Home' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;
  const recommendedProducts = await storefront.query(RECOMMENDED_PRODUCTS_QUERY);
  const recommendedArticles = await storefront.query(RECOMMENDED_BLOG_ARTICLES_QUERY);

  return json({ recommendedProducts, recommendedArticles });
}

export default function Homepage() {
  const { recommendedArticles, recommendedProducts } = useLoaderData<typeof loader>();
  const isMobile = useViewport();

  if (isMobile !== null) {
    return (
      <>
        <HeroSlideShow
          viewport={isMobile ? 'mobile' : 'desktop'}
        />
        <BestSellingProducts products={recommendedProducts} />
        <TrustPilotBanner viewport={isMobile ? 'mobile' : 'desktop'} />
        <GetSocial viewport={isMobile ? 'mobile' : 'desktop'} />
        <Tips articles={recommendedArticles} viewport={isMobile ? 'mobile' : 'desktop'} />
        <WhyOurFormula viewport={isMobile ? 'mobile' : 'desktop'} />
      </>
    );
  }
  else return <></>
}

function NavigateToProductPageButton({ handle }: { handle: string }) {
  const navigate = useNavigate();
  return <ArrowButton label="VIEW ALL SIZES" onClick={() => navigate(`/products/${handle}`)} />
}

function HeroSlideShow({ viewport }: { viewport?: Viewport }) {

  const data: HeroProps[] = [
    {
      title: "Outdoor Surface Cleaners",
      subtitle: "Giving your vehicle a showroom look without damaging or affecting its paintwork, while keeping its gloss finish.",
      backgroundImage: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/washer_man.png?v=1717245774',
      ctaOnClick: () => { },
      ctaText: 'Shop Collection',
      viewport
    },
    {
      title: "Traffic Film Removers",
      subtitle: "Giving your vehicle a showroom look without damaging or affecting its paintwork, while keeping its gloss finish.",
      backgroundImage: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/defender_tyre_wash.jpg?v=1718738895',
      ctaOnClick: () => { },
      ctaText: 'Shop Collection',
      viewport
    },
    {
      title: "Snow Foam Shampoo",
      subtitle: "Giving your vehicle a showroom look without damaging or affecting its paintwork, while keeping its gloss finish.",
      backgroundImage: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/soapy_sports_car.jpg?v=1718738897',
      ctaOnClick: () => { },
      ctaText: 'Shop Collection',
      viewport
    },
    {
      title: "Alloy Wheel Cleaner",
      subtitle: "Giving your vehicle a showroom look without damaging or affecting its paintwork, while keeping its gloss finish.",
      backgroundImage: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/alloys-being-washed.jpg?v=1718738896',
      ctaOnClick: () => { },
      ctaText: 'Shop Collection',
      viewport
    }
  ]

  return <Carousel
    opts={{
      loop: true,
      duration: 35
    }}
    plugins={[
      //@ts-ignore
      Autoplay({
        delay: 7000,
      }),
    ]}
  >
    <CarouselContent>
      {data.map((heroProps) => (
        <CarouselItem key={heroProps.backgroundImage} className='pl-0'>
          <Hero {...heroProps} />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselBreadcrumbs />
  </Carousel>
}

interface HeroProps {
  title: string,
  subtitle: string,
  ctaText: string,
  ctaOnClick: () => void,
  backgroundImage: string
  viewport?: Viewport
}

function Hero({
  title,
  subtitle,
  ctaText,
  ctaOnClick,
  backgroundImage,
  viewport = 'desktop'
}: Readonly<HeroProps>) {
  if (viewport === 'mobile') {
    return <div
      className="relative bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})`, height: '650px' }}
    >
      <div style={{ background: 'linear-gradient(to top, rgba(11,21,57,0.75), rgba(11,21,57,0.4) )' }} className="absolute w-full inset-0 "></div>
      <div className='container flex h-full py-16 px-10'>
        <div className="relative z-1 flex items-center flex-col text-center text-white max-w-2xl">
          <h1 className="text-8xl font-display">{title}</h1>
          <div className='w-full'><DashDivider /></div>
          <p className="text-xl mb-5 mt-2">{subtitle}</p>
          <div className='w-52'><ArrowButton label={ctaText} onClick={ctaOnClick} /></div>
        </div>
      </div>
    </div>
  } else {
    return <div
      className="relative bg-cover bg-center "
      style={{ backgroundImage: `url(${backgroundImage})`, height: '700px' }}
    >
      <div style={{ background: 'linear-gradient(to right, rgba(11,21,57,0.75), transparent )' }} className="absolute w-8/12 inset-0 "></div>
      <div className='container flex items-center justify-left h-full p-10'>
        <div className="relative z-10 text-left text-white max-w-sm">
          <Heading className='text-9xl !text-white font-display' dashClassName='w-16' level={1}>{title}</Heading>
          <p className="text-xl mb-5">{subtitle}</p>
          <div className='w-52'><ArrowButton label={ctaText} onClick={ctaOnClick} /></div>
        </div>
      </div>
    </div>
  }
}

function BestSellingProducts({
  products,
}: Readonly<{
  products: RecommendedProductsQuery;
}>) {

  return (
    <div className="p-10 container">
      <Heading className='text-center text-6xl font-display' level={2}>Our Best Sellers</Heading>
      <Suspense fallback={<div>Loading...</div>}>
        <Carousel opts={{
          align: "start",
          loop: true,
        }}
          className="mt-3 mx-6 px-0 md:mx-0 md:px-6"
        >
          <CarouselContent>
            <Await resolve={products}>
              {({ products }) => (
                <>
                  {products.nodes.map((product) => (
                    <CarouselItem key={product.id} className="w-min md:basis-1/5 pl-0 flex justify-center">
                      <ProductCard
                        id={product.id}
                        imageData={product.images.nodes[0] as StorefrontAPI.Image}
                        title={product.title}
                        price={product.priceRange.minVariantPrice as StorefrontAPI.MoneyV2}
                        handle={product.handle}
                        ActionElement={NavigateToProductPageButton}
                      />
                    </CarouselItem>
                  ))}
                </>
              )}
            </Await>
          </CarouselContent>
          <CarouselNext className='mobile-component' skip={1} style={{ top: "40%", right: "-1.5rem" }} />
          <CarouselNext className='desktop-component' skip={2} style={{ top: "40%", right: "-1.5rem" }} />
          <CarouselPrevious className='mobile-component' skip={1} style={{ top: "40%", left: "-1.5rem" }} />
          <CarouselPrevious className='desktop-component' skip={2} style={{ top: "40%", left: "-1.5rem" }} />
        </Carousel>
      </Suspense>
    </div>
  );
}

function TrustPilotBanner({ viewport = 'desktop' }: { viewport?: Viewport }) {
  return <BlueBubbleBackground >
    <div className='p-10 container'>
      <TrustBox />
    </div>
  </BlueBubbleBackground>
}

function GetSocial({ viewport = 'desktop' }: { viewport?: Viewport }) {

  const socialImages = [{
    url: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/merc-wheel.jpg?v=1718809192',
    alt: 'mercedes_tyre',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/combine-spray.jpg?v=1718810056',
    alt: 'spraying_combine_harvester',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/jen-protect.jpg?v=1718809189',
    alt: 'jen_spray',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/100-porsche.jpg?v=1718809192',
    alt: '100_porsche_interior',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/tfr-ultra.jpg?v=1718809191',
    alt: 'tfr_ultra',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/kermit-porsche.jpg?v=1718809192',
    alt: 'kermit_porsche_interior',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/dashboard_spray.jpg?v=1718809190',
    alt: 'dashboard_spray',
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0032/5474/7185/files/discovery-clean.jpg?v=1718809253',
    alt: 'landrover_discovery',
  }
  ]

  if (viewport === 'mobile') {
    return <div className='flex flex-col items-center p-6 container text-center'>
      <Heading className='text-center text-7xl font-display' level={1}>Get Social <br /> & Share<span className='!text-jc-light-blue'>!</span></Heading>
      <div className="w-full h-auto mb-4 rounded-lg drop-shadow-[0_0_6px_rgba(8,13,63,0.5)]">
        <img src="https://cdn.shopify.com/s/files/1/0032/5474/7185/files/kermit-porsche.jpg?v=1718809192" alt="grid-1" />
      </div>
      <span className='mb-2'>
        Follow us on social media to see our products in action, followed by the final result. Also to see what new products we currently
        have in development, along with limited time offers.<br />
        We also like to see what you can achieve by using our products.
        Use the hashtag <span className='text-jc-light-blue'>#jennychem</span> when posting to show your results!
      </span>
      <div className="flex flex-row gap-1 my-2">
        <a href="https://google.com"><img alt="Facebook" className='h-[32px] w-[32px]' src={FacebookIcon} /></a>
        <a href="https://google.com"><img alt="Youtube" className='h-[32px] w-[32px]' src={YoutubeIcon} /></a>
        <a href="https://google.com"><img alt="Instagram" className='h-[32px] w-[32px]' src={InstagramIcon} /></a>
        <a href="https://google.com"><img alt="Tiktok" className='h-[32px] w-[32px]' src={TiktokIcon} /></a>
      </div>
    </div>
  } else {
    return <div className='flex flex-row-reverse p-10 container'>
      <div style={{ height: 'fit-content' }} className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-2 gap-4 p-4 '>
        {socialImages.map(({ url, alt }, index) => (
          <div key={index} className={`w-48 h-48 ${(index == 7) || (index == 6) ? "hidden xl:block" : ""} ${(index == 5) || (index == 4) ? "hidden lg:block" : ""} overflow-hidden drop-shadow-[0_0_6px_rgba(8,13,63,0.5)]`}>
            <img className='w-full h-full object-cover rounded-lg' src={url} alt={alt} />
          </div>
        ))}

      </div>
      <div className='flex-1 flex flex-col justify-between  p-4 text-jc-dark-blue'>
        <div>
          <Heading className='text-8xl font-display' dashClassName='w-16' level={1}>Get Social <br /> & Share<span className='text-jc-light-blue'>!</span></Heading>
          <p className='mb-3'>
            Follow us on social media to see our products in action, followed by the final result. Also to see what new products we currently
            have in development, along with limited time offers.
          </p>
          <p>
            We also like to see what you can achieve by using our products.
            Use the hashtag <span className='text-jc-light-blue'>#jennychem</span> when posting to show your results!
          </p>
        </div>
        <div className="flex flex-row gap-1 my-2">
          <a href="https://google.com"><img alt="Facebook" className='h-[32px] w-[32px]' src={FacebookIcon} /></a>
          <a href="https://google.com"><img alt="Youtube" className='h-[32px] w-[32px]' src={YoutubeIcon} /></a>
          <a href="https://google.com"><img alt="Instagram" className='h-[32px] w-[32px]' src={InstagramIcon} /></a>
          <a href="https://google.com"><img alt="Tiktok" className='h-[32px] w-[32px]' src={TiktokIcon} /></a>
        </div>
      </div>
    </div>
  }
}

function Tips({ articles, viewport = 'desktop' }: Readonly<{
  articles: RecommendedBlogArticlesQuery
  viewport?: Viewport
}>) {
  return <BlueBubbleBackground>
    <div className="p-10 container ">
      <Heading className='text-center text-6xl !text-jc-light-blue font-display' level={2}>Tips & Tricks <span className='text-white'>When It Comes To Cleaning</span></Heading>
      <ArticleCarousel articles={articles.articles} viewport={viewport} />
    </div>
  </BlueBubbleBackground >
}

function WhyOurFormula({ viewport = 'desktop' }: { viewport?: Viewport }) {
  if (viewport === 'mobile') {
    return <div className='flex flex-col items-center text-center p-6 container text-jc-dark-blue'>
      <Heading level={1} className='font-display text-8xl'>Why Our Formula <span className="!text-jc-light-blue">?</span></Heading>
      <div className="shadow rounded-lg overflow-hidden" >
        <ReactPlayer controls width="100%" height="100%" url="https://cdn.shopify.com/videos/c/o/v/94a5987a06e046eb99f7128481f0d7c7.mp4" />
      </div >
      <p className='mt-5 mb-3'>Jennychem is one of the UK’s leading cleaning products suppliers for both businesses and consumers. We are a family oriented business that has been in operation for more than 25 years.</p>
      <p>  Providing a vast range of products, including vehicle care and kitchen sanitation. All our products are formulated and then manufactured on site within the UK.</p>
      <div className='mt-5'><ArrowButton label="About Us" onClick={() => ''} /></div>
    </div >
  } else {
    return <div className='flex flex-row p-10 container'>
      <div className='p-4 w-2/3'>
        <div className="shadow rounded-lg overflow-hidden">
          <ReactPlayer controls width="100%" height="100%" url="https://cdn.shopify.com/videos/c/o/v/94a5987a06e046eb99f7128481f0d7c7.mp4" />
        </div>
      </div>
      <div className='flex-1 p-4 text-jc-dark-blue'>
        <Heading level={1} className='font-display text-8xl' dashClassName='w-16'>Why Our Formula <span className="!text-jc-light-blue">?</span></Heading>
        <p className='mb-3'>Jennychem is one of the UK’s leading cleaning products suppliers for both businesses and consumers. We are a family oriented business that has been in operation for more than 25 years.</p>
        <p>  Providing a vast range of products, including vehicle care and kitchen sanitation. All our products are formulated and then manufactured on site within the UK.</p>
        <div className='mt-4 w-36'><ArrowButton label="ABOUT US" onClick={() => ''} /></div>
      </div>
    </div>
  }
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
                variants(first: 1) {
                  nodes {
                    sku
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

