import { ArticleContentFragment } from "storefrontapi.generated"
import DashDivider from "./DashDivider"


export const PageHeader = ({
    imageUrl,
    title,
    subTextNode
}: {
    imageUrl: string | undefined;
    title: string;
    subTextNode: React.ReactNode
}) => {
    return <div className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})`, height: 'fit-content' }}>
        <div style={{ background: 'linear-gradient(to right, rgba(11,21,57,0.75), rgba(11,21,57,0) )' }} className="absolute w-full inset-0 " />
        <div className='container relative pt-14 z-10 text-white'>
            <h1 className='w-[50%] font-display text-8xl tracking-large'>{title}</h1>
            <div className='w-16'><DashDivider className='-mt-3 h-[3px]' /></div>
            {subTextNode}
        </div>
    </div>
}