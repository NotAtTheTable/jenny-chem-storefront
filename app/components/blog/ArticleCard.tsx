import lbarrow from "~/assets/foundational/light_blue_filled_arrow_right.svg"

export function ArticleCard({
    title,
    publishedAt,
    imageUrl,
    onClick
}: {
    title: string
    publishedAt: Date,
    imageUrl: string | undefined,
    onClick: () => void
}) {
    return <div style={{ backgroundImage: `url(${imageUrl})` }} className="bg-cover bg-center relative w-52 h-52 rounded" onClick={onClick}>
        <div style={{ background: 'linear-gradient(to top, rgba(11,21,57,1), transparent)' }} className="absolute inset-0 rounded"></div>
        <div className="relative flex h-full flex-col justify-between align-left  p-2">
            <div></div>
            <div className="text-white">
                <h1 className="font-display text-xl">
                    {title}
                </h1>
                <div className="flex flex-row text-sm justify-between border-t border-jc-light-blue py-1">
                    <div>Read full article here</div>
                    <img alt="arrow" src={lbarrow} />
                </div>
            </div>
        </div>
    </div>
}