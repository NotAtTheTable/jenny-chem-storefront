import { Link } from "@remix-run/react"
import lbarrow from "~/assets/foundational/light_blue_filled_arrow_right.svg"
import { cn } from "~/lib/utils"

export function ArticleCard({
    handle,
    title,
    publishedAt,
    imageUrl,
    onClick,
    className
}: {
    handle: string
    title: string
    publishedAt: Date,
    imageUrl: string | undefined,
    onClick?: () => void,
    className?: string
}) {
    return <Link to={`/blogs/news/${handle}`}>
        <div style={{ backgroundImage: `url(${imageUrl})` }} className={cn(["shadow bg-cover bg-center relative rounded-lg w-[300px]", className])}>
            <div style={{ background: 'linear-gradient(to top, rgba(11,21,57,1), transparent)' }} className="absolute inset-0 rounded-lg"></div>
            <div className="relative flex h-full flex-col justify-between align-left p-3">
                <div></div>
                <div className="text-white">
                    <h1 className="font-display line-clamp-2 text-[32px] tracking-wide leading-[30px]">
                        {title}
                    </h1>
                    <div className="flex flex-row text justify-between border-t border-jc-light-blue mt-2 pt-2">
                        <div>Read full article here</div>
                        <img alt="arrow" src={lbarrow} />
                    </div>
                </div>
            </div>
        </div>
    </Link>
}