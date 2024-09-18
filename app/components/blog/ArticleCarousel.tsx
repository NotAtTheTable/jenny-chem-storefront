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

    const [currentLastIndex, setCurrentLastIndex] = useState<number>(0);

    if (viewport == "mobile") {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Await resolve={articles}>
                    {({ nodes }) => (
                        <Carousel opts={{
                            align: "start",
                            loop: true,
                        }}
                            className="w-72 mt-3"
                        >
                            <CarouselContent className="-ml-3">
                                {nodes.map((article) => (
                                    <CarouselItem key={article.id} className="pl-9 basis-1/1">
                                        <ArticleCard
                                            handle={article.handle}
                                            title={article.title}
                                            publishedAt={new Date(article.publishedAt)}
                                            imageUrl={article.image?.url || undefined}
                                            onClick={() => { return '' }}
                                            className="w-60 h-60"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselNext white={mode === "dark"} skip={1} currentLastIndex={currentLastIndex} setLastIndex={setCurrentLastIndex} style={{ top: "40%", right: "-1.5rem" }} />
                            <CarouselPrevious skip={1} white={mode === "dark"} currentLastIndex={currentLastIndex} setLastIndex={setCurrentLastIndex} style={{ top: "40%", left: "-1.5rem" }} />
                        </Carousel>
                    )}
                </Await>
            </Suspense>
        )
    } else {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <Await resolve={articles}>
                    {({ nodes }) => (
                        <Carousel opts={{
                            align: "start",
                            loop: true,
                        }}
                            className="w-[90%] 2xl:w-full max-w-8xl mt-3"
                        >
                            <CarouselContent className="-ml-2">
                                {nodes.map((article) => (
                                    <CarouselItem key={article.id} className="pl-2 basis-1/3 2xl:basis-1/4">
                                        <ArticleCard
                                            handle={article.handle}
                                            title={article.title}
                                            publishedAt={new Date(article.publishedAt)}
                                            imageUrl={article.image?.url || undefined}
                                            onClick={() => { return '' }}
                                            className="w-[310px] h-60"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselNext white={mode == "dark"} skip={2} currentLastIndex={currentLastIndex} setLastIndex={setCurrentLastIndex} style={{ top: "50%", right: "-4rem" }} />
                            <CarouselPrevious white={mode == "dark"} skip={2} currentLastIndex={currentLastIndex} setLastIndex={setCurrentLastIndex} style={{ top: "50%", left: "-4.5rem" }} />
                        </Carousel>
                    )}
                </Await>
            </Suspense>
        )
    }
}