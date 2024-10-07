import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import DashDivider from '~/components/foundational/DashDivider';
import { PageHeader } from '~/components/foundational/PageHeader';
import Heading from '~/components/foundational/Heading';
import { useState } from 'react';
import ArrowLeft from '~/assets/foundational/arrows/filled_dark_blue_left_arrow.svg';
import ArrowRight from '~/assets/foundational/arrows/filled_dark_blue_right_arrow.svg';
import { ArrowButton } from '~/components/foundational/ArrowButton';
import ReactPlayer from 'react-player';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';


export const meta: MetaFunction = () => {
    return [{ title: 'About Us' }];
};

export async function loader({ context }: LoaderFunctionArgs) {
    // You can fetch any data needed for this page here
    return json({});
}

const TimeLine = () => {

    const [selectedYear, setSelectedYear] = useState<number>(0);

    const years = [
        {
            year: '1985',
            description: "It all started in a modest garage when Jenny, at just 18 years old, founded our company. With a focus on supplying cleaning solutions to transport companies, she took charge of manufacturing, orders, and deliveries, managing every aspect single-handedly."
        },
        {
            year: '1988',
            description: "The company took a significant leap forward, moving into our first warehouse and expanding our team to include another dedicated member. We also introduced more sophisticated equipment like mixing tanks, significantly boosting our production capabilities and allowing us to serve an increasing number of customers."
        },
        {
            year: '1990',
            description: "This year marked the purchase of our first office in Medway, along with the addition of commercial vehicles that greatly enhanced our delivery efficiency. Transitioning from deliveries, Jenny embraced the role of a traveling saleswoman, expanding our reach and fostering customer relationships."
        },
        {
            year: '1991',
            description: "Building on our steady growth, we embarked on our first major advertising campaign by featuring in Commercial Motor magazine. This strategic move significantly raised our profile within the transport industry, attracting a broader customer base. The year was crowned with a monumental achievement—reaching our first £1 million in revenue."
        },
        {
            year: '2006',
            description: "A major milestone was reached with the relocation to a larger, 18,500 sq ft warehouse and office space. This expansion was in response to growing demand and supported a significantly larger team, gearing us up for the next phase of growth."
        },
        {
            year: '2015',
            description: "We continued to expand our operations by acquiring a tank farm, which now holds over 300k litres of raw materials. This strategic move ensured a steady supply of inputs, crucial for meeting our production schedules and customer demands."
        },
        {
            year: '2018',
            description: "Launching our online store marked a pivotal shift towards a digital presence, reflecting changing consumer behaviors and expanding our market reach. The same year, we celebrated a major achievement of reaching 100,000 orders."
        },
        {
            year: '2023',
            description: "With our warehouse now fully occupied and operating at peak capacity, we integrated a new stock system to streamline inventory management. This was crucial in keeping pace with our annual customer orders, which have soared to 150k."
        }]

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full desktop-component">
                <div className="flex flex-row justify-center items-center w-full" >
                    <button onClick={() => setSelectedYear(selectedYear === 0 ? selectedYear : selectedYear - 1)}><img src={ArrowLeft} /></button>
                    {years.map(({ year }, index) => (
                        <div key={index} className="relative flex flex-1 items-center h-40">

                            <div className={`w-16 h-[2.5px] ${index === 0 ? "bg-jc-dark-blue" : "bg-jc-dark-blue"} flex-1`}></div>
                            <button
                                onClick={() => setSelectedYear(index)}
                                className={`${selectedYear === index ? "w-[90%] h-auto aspect-[1/1] bg-jc-dark-blue border-jc-light-blue text-white text-5xl" : "w-[70%] h-auto aspect-[1/1] bg-transparent text-jc-dark-blue border-jc-dark-blue text-4xl"} rounded-full border-[2.5px] flex items-center justify-center font-display transition-all duration-300`}
                            >
                                {year}
                            </button>
                            <div className={`w-full h-[2.5px] ${index === years.length - 1 ? "bg-jc-dark-blue" : "bg-jc-dark-blue"} flex-1`}></div>

                            {selectedYear === index && <div className="w-0 h-0 absolute -bottom-8  left-1/2 transform -translate-x-1/2
                                border-l-[10px] border-l-transparent
                                border-b-[15px] border-b-white
                                border-r-[10px] border-r-transparent">
                            </div>}
                        </div>
                    ))}
                    <button onClick={() => setSelectedYear(selectedYear === years.length - 1 ? selectedYear : selectedYear + 1)}><img src={ArrowRight} /></button>
                </div>
                <div className="mt-8 text-center bg-white shadow rounded-lg p-4">
                    <p>
                        <strong>
                            {years[selectedYear].description}
                        </strong>
                    </p>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full mobile-component">
                <div className="flex flex-row justify-center items-center w-full" >
                    <button onClick={() => setSelectedYear(selectedYear === 0 ? selectedYear : selectedYear - 1)}><img src={ArrowLeft} /></button>

                    <div className="relative flex flex-1 items-center h-40">
                        <div className={`w-16 h-[2.5px] bg-jc-dark-blue flex-1`}></div>
                        <div className={`w-[12%] h-auto aspect-[1/1] border-jc-dark-blue rounded-full border-[2.5px]`} />
                        <div className={`w-16 h-[2.5px] bg-jc-dark-blue flex-1`}></div>
                        <div

                            className={`w-[50%] h-auto aspect-[1/1] bg-jc-dark-blue border-jc-light-blue text-white text-5xl rounded-full border-[2.5px] flex items-center justify-center font-display transition-all duration-300`}
                        >
                            {years[selectedYear].year}
                        </div>
                        <div className={`w-full h-[2.5px] bg-jc-dark-blue flex-1`}></div>
                        <div className={`w-[12%] h-auto aspect-[1/1] border-jc-dark-blue rounded-full border-[2.5px]`} />
                        <div className={`w-full h-[2.5px] bg-jc-dark-blue flex-1`}></div>

                        <div className="w-0 h-0 absolute -bottom-9  left-1/2 transform -translate-x-1/2
                                border-l-[15px] border-l-transparent
                                border-b-[20px] border-b-white
                                border-r-[15px] border-r-transparent">
                        </div>
                    </div>

                    <button onClick={() => setSelectedYear(selectedYear === years.length - 1 ? selectedYear : selectedYear + 1)}><img src={ArrowRight} /></button>
                </div>
                <div className="mt-8 text-center bg-white shadow rounded-lg p-4">
                    <p>
                        <strong>
                            {years[selectedYear].description}
                        </strong>
                    </p>
                </div>
            </div >
        </>
    )
}

export default function About() {
    return (
        <>
            <div className='mobile-component'>
                <div className='bg-cover bg-center border-b-[0.75px] border-[#B2C1E0]' style={{ backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Product_Page_Background.jpg?v=1725392399)' }}>
                    <div className='container pt-10 pb-10'>
                        <Heading className='text-[90px] leading-none text-center' level={1}><span className='text-jc-light-blue'>40 YEARS</span> OF KNOWLEDGE</Heading>
                        <TimeLine />
                    </div>
                </div>
                <div className='text-center px-4 my-7'>
                    <div>
                        <Heading level={1} className='text-6xl'>LOOKING AHEAD</Heading>
                        <p className='-mt-1'>
                            As we look to the future, each year presents new opportunities and challenges. With over £10 million in annual revenue, our commitment to delivering excellence and innovation has never been stronger. We invite you to join us as we continue to grow and evolve.
                        </p>
                    </div>
                    <div className='rounded-md overflow-hidden shadow my-6'>
                        <ReactPlayer height={"100%"} width={"auto"} controls url={"https://cdn.shopify.com/videos/c/o/v/a486b379bd794422bdb095c1292f30c6.mp4"}></ReactPlayer>
                    </div>
                    <div>
                        <Heading level={1} className='text-6xl'>OUR PRODUCTS</Heading>
                        <p className='-mt-1'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Consectetur adipiscing elit, sed do eius
                            mod tempor incididunt ut labore et dolore.
                            <br /><br />
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Consectetur adipiscing elit, sed do eius mod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Consectetur adipiscing elit sed do eius.
                        </p>
                    </div>
                </div>
            </div>
            <div className='desktop-component about-page text-jc-dark-blue'>
                <div className='bg-cover bg-center border-b-[0.75px] border-[#B2C1E0]' style={{ backgroundImage: 'url(https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Product_Page_Background.jpg?v=1725392399)' }}>
                    <div className='container pt-16 pb-10'>
                        <Heading className='text-8xl text-center' level={1}><span className='text-jc-light-blue'>40 YEARS</span> OF KNOWLEDGE</Heading>
                        <TimeLine />
                    </div>
                </div>
                <div className='container my-16 flex flex-row gap-16'>
                    <div className='bg-jc-dark-blue w-[374px] p-6 rounded-3xl shadow flex flex-col justify-between'>
                        <div>
                            <Heading dashClassName='w-16' level={1} className='!text-white text-8xl'>WHO <br /> WE ARE.</Heading>
                            <p className='text-white -mt-1'>Providing the correct workwear and equipment for the job, with a range from clothing to accessories to choose from.</p>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <ArrowButton label='PLAY VIDEO' className='w-max mt-5' />
                            </DialogTrigger>
                            <DialogContent className='max-w-fit h-fit p-10'>
                                <div className='rounded-lg overflow-hidden shadow'>
                                    <ReactPlayer controls url={"https://cdn.shopify.com/videos/c/o/v/a486b379bd794422bdb095c1292f30c6.mp4"}></ReactPlayer>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className='flex flex-1 flex-row gap-16'>
                        <div>
                            <Heading dashClassName='w-16' level={1} className='text-6xl'>LOOKING AHEAD<span className='text-jc-light-blue'>.</span></Heading>
                            <p className='-mt-1'>
                                As we look to the future, each year presents new opportunities and challenges. With over £10 million in annual revenue, our commitment to delivering excellence and innovation has never been stronger. We invite you to join us as we continue to grow and evolve.
                            </p>
                        </div>
                        <div>
                            <Heading dashClassName='w-16' level={1} className='text-6xl'>OUR PRODUCTS<span className='text-jc-light-blue'>.</span></Heading>
                            <p className='-mt-1'>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Consectetur adipiscing elit, sed do eius
                                mod tempor incididunt ut labore et dolore.
                                <br /><br />
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Consectetur adipiscing elit, sed do eius mod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Consectetur adipiscing elit sed do eius.
                            </p>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
