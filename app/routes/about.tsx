import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import DashDivider from '~/components/foundational/DashDivider';
import { PageHeader } from '~/components/foundational/PageHeader';
import Heading from '~/components/foundational/Heading';
import { useState } from 'react';
import ArrowLeft from '~/assets/foundational/arrows/filled_dark_blue_left_arrow.svg';
import ArrowRight from '~/assets/foundational/arrows/filled_dark_blue_right_arrow.svg';
import { ArrowButton } from '~/components/foundational/ArrowButton';


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
            description: "The company launched its first innovative chemical product, revolutionizing the industry with a new eco-friendly solvent that quickly gained popularity among manufacturers. This product not only set a new standard for sustainability in chemical production but also marked the beginning of a commitment to environmentally responsible practices that would define the company's ethos for decades to come."
        },
        {
            year: '1988',
            description: "In a bold move, the company expanded its operations internationally, establishing a new facility in Europe to meet the growing demand for its products. This strategic decision not only allowed the company to tap into new markets but also facilitated the exchange of innovative ideas and practices across borders, enhancing its global footprint and influence in the industry."
        },
        {
            year: '1990',
            description: "The introduction of a groundbreaking polymer changed the landscape of materials science, leading to partnerships with major automotive and aerospace companies. This innovation not only showcased the company's technological prowess but also paved the way for advancements in product performance and safety, significantly impacting various industries."
        },
        {
            year: '1991',
            description: "The company faced challenges during a global recession but emerged stronger by diversifying its product line and investing in research and development. This resilience demonstrated the company's ability to adapt to market fluctuations and reinforced its commitment to innovation, ensuring long-term sustainability and growth."
        },
        {
            year: '2006',
            description: "Celebrating its 21st anniversary, the company launched a sustainability initiative, committing to reduce its carbon footprint and promote green chemistry practices. This initiative not only highlighted the company's dedication to environmental stewardship but also inspired other industry players to adopt similar practices, fostering a culture of sustainability within the sector."
        },
        {
            year: '2015',
            description: "The company was recognized with several industry awards for its innovative approaches to chemical safety and environmental stewardship, solidifying its reputation as a leader in the field. These accolades not only validated the company's efforts but also motivated it to continue pushing the boundaries of what is possible in chemical manufacturing."
        },
        {
            year: '2018',
            description: "A major breakthrough in nanotechnology allowed the company to develop advanced materials with unprecedented properties, opening new markets and applications. This leap forward not only enhanced the company's product offerings but also positioned it at the forefront of technological innovation, attracting interest from various sectors looking to leverage these advancements."
        },
        {
            year: '2023',
            description: "The company embraced digital transformation, implementing AI-driven processes to enhance production efficiency and customer engagement, setting the stage for future growth. This strategic shift not only optimized operations but also improved the overall customer experience, ensuring that the company remains competitive in an increasingly digital marketplace."
        }]

    return (
        <>
            <div className="flex flex-col justify-center items-center w-full">
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

        </>
    )
}

export default function About() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className='about-page text-jc-dark-blue'>
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
                    <ArrowButton label='PLAY VIDEO' className='w-max mt-5' />
                </div>
                <div className='flex flex-1 flex-row gap-16'>
                    <div>
                        <Heading dashClassName='w-16' level={1} className='text-6xl'>OUR EXPERIENCE<span className='text-jc-light-blue'>.</span></Heading>
                        <p className='-mt-1'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Consectetur adipiscing elit, sed do eius
                            mod tempor incididunt ut labore et dolore.
                            <br /><br />
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip. Consectetur adipiscing elit, sed do eius mod tempor incididunt ut labore et dolore magna aliqua.
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Consectetur adipiscing elit sed do eius.
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
    );
}
