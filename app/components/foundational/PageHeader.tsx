import { ArticleContentFragment } from "storefrontapi.generated"
import DashDivider from "./DashDivider"
import Heading from "./Heading";
import { cn } from "~/lib/utils";


export const PageHeader = ({
    gradientCurtain = true,
    imageUrl,
    title,
    headingTextClassName,
    subTextNode
}: {
    gradientCurtain?: boolean;
    imageUrl: string | undefined;
    title: string;
    headingTextClassName?: string;
    subTextNode: React.ReactNode
}) => {
    return <div className="relative bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})`, height: 'fit-content' }}>
        {gradientCurtain && <div style={{ background: 'linear-gradient(to right, rgba(11,21,57,0.75), rgba(11,21,57,0) )' }} className="absolute w-full inset-0 " />}
        <div className='container relative pt-14 z-5 text-white'>
            <Heading level={1} className={headingTextClassName} dashClassName="w-16">{title}</Heading>
            {subTextNode}
        </div>
    </div>
}