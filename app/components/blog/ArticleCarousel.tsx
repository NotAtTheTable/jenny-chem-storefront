import { Await } from "@remix-run/react"
import { Suspense, useState } from "react"
import { ArticleCard } from "../card/ArticleCard"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import { Viewport } from "~/routes/_index"
import { RecommendedBlogArticlesQuery } from "storefrontapi.generated"

export const ArticleCarousel = ({ articles, viewport = "desktop", mode = "dark" }: Readonly<{
    articles: RecommendedBlogArticlesQuery["articles"]
    viewport?: Viewport;
    mode?: "light" | "dark";
}>) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={articles}>
                {({ nodes }) => (
                    <Carousel opts={{
                        align: "start",
                        skipSnaps: true,
                        loop: true,
                    }}
                        className="mt-3 mx-6 px-0 md:mx-0 md:px-6"
                    >
                        <CarouselContent>
                            {nodes.map((article) => (
                                <CarouselItem key={article.id} className="w-min md:basis-1/3 xl:basis-1/4 pl-0 flex justify-center">
                                    <ArticleCard
                                        handle={article.handle}
                                        title={article.title}
                                        publishedAt={new Date(article.publishedAt)}
                                        imageUrl={article.image?.url || undefined}
                                        onClick={() => { return '' }}
                                        className="h-60"
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselNext white={mode == "dark"} className='mobile-component' skip={1} style={{ right: "-2.5rem" }} />
                        <CarouselNext white={mode == "dark"} className='desktop-component' skip={2} style={{ right: "-1.5rem" }} />
                        <CarouselPrevious white={mode == "dark"} className='mobile-component' skip={1} style={{ left: "-2.5rem" }} />
                        <CarouselPrevious white={mode == "dark"} className='desktop-component' skip={2} style={{ left: "-1.5rem" }} />
                    </Carousel>
                )}
            </Await>
        </Suspense>
    )
}