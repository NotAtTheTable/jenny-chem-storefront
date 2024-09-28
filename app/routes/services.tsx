import { useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { ArrowButton } from '~/components/foundational/ArrowButton';
import DashDivider from '~/components/foundational/DashDivider';
import Heading from '~/components/foundational/Heading';

const ContactUsButton = () => {
    const navigate = useNavigate();
    return <ArrowButton className='w-max md:mt-6' label='CONTACT US' aria-label='contact-us' onClick={() => navigate(`/contact`)} />
}

const PrivateLabelServices = () => {

    const images: { title: string; content: string; imageUrl: string; }[] = [
        {
            title: "PRODUCT PACKAGING",
            content: "Assistance in sourcing packaging if our range does not suffice, subject to subject to MOQ.",
            imageUrl: "https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Web_Services_Assets_Packaging_Desktop.png?v=1727384777"
        },
        {
            title: "DATA SHEETS",
            content: "CLP Regulation compliant Data Sheets for chemical products with your branding.",
            imageUrl: "https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Web_Services_Assets_Data_Sheet_Desktop.png?v=1727384777"
        },
        {
            title: "LABEL DESIGN",
            content: "Crafted product labels to suit your brand identity, with additional print options.",
            imageUrl: "https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Web_Services_Assets_Private_Label_Desktop.png?v=1727384776"
        },
    ];

    return (
        <div className='text-center md:text-left flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-20 py-6 md:py-12'>
            <div className='max-w-lg'>
                <div className='desktop-component'><Heading dashClassName='w-16' className='text-8xl !text-white' level={1}>PRIVATE <br /> LABEL SERVICES</Heading></div>
                <div className='mobile-component'><Heading className='text-6xl !text-white mobile-component' level={1}>PRIVATE LABELS</Heading></div>
                <p className='mb-4'>Elevate your products with our white labelling service. Which empowers you to expand your product line and customer loyalty, without resorting to a custom product or formulation service. We are committed to providing a tailored solution to meet demands.</p>
                <p>We extend white labelling to all our customers for a nominal fee, provided the minimum order requirements are met: 80 x 5 Litre, 20 x 20 Litre, 4 x 205 Litre, or 1 x 1000 Litre. For further details on our label services, please complete the contact form, and we will promptly respond to your inquiry.</p>
                <div className='desktop-component'><ContactUsButton /></div>
            </div>
            <div className='flex flex-col md:flex-row gap-6 md:gap-10'>
                {images.map(({ title, content, imageUrl }) => (
                    <div className='text-center flex flex-col items-center' key={title}>
                        <img className='h-[150px]' src={imageUrl} />
                        <Heading className='mt-3 text-4xl !text-white' level={3}>{title}</Heading>
                        <p className='-mt-2'>{content}</p>
                    </div>
                ))}
            </div>
            <div className='mobile-component'><ContactUsButton /></div>
        </div>
    )
}

const ChemicalBulkSupply = () => {
    return (
        <>
            <div className='desktop-component flex flex-col md:flex-row py-12 gap-10'>
                <div className='w-full md:max-w-[60%]'>
                    <img className='md:min-w-full h-auto' src="https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Web_Services_Assets_Bulk_Chemical_Supply.png?v=1727385372" />
                </div>
                <div className='w-[40%]'>
                    <Heading dashClassName='w-16' className='text-8xl !text-white' level={1}>CHEMICAL <br /> BULK SUPPLY</Heading>
                    <p className='mb-4'>Experience cost savings and premium quality chemical products, by partnering with us for your bulk chemical needs. We cater to businesses which have significant annual chemical requirements. Providing an extensive array of solutions designed to enhance efficiency and reduce additional expenses.</p>
                    <p>Our comprehensive range includes a diverse selection of chemicals to meet the unique demands. We focus on maintaining the highest standards in manufacturing and sourcing, ensuring that you receive exceptional products without compromising effectiveness. To learn more please complete the contact form with your inquiry.</p>
                    <ContactUsButton />
                </div>
            </div>
            <div className='mobile-component text-center py-6'>
                <Heading className='text-6xl !text-white mobile-component' level={1}>BULK SUPPLY</Heading >
                <img src="https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Web_Services_Assets_Bulk_Chemical_Supply.png?v=1727385372" />
                <p className='mt-6 mb-4'>Experience cost savings and premium quality chemical products, by partnering with us for your bulk chemical needs. We cater to businesses which have significant annual chemical requirements. Providing an extensive array of solutions designed to enhance efficiency and reduce additional expenses.</p>
                <p className='mb-6'>Our comprehensive range includes a diverse selection of chemicals to meet the unique demands. We focus on maintaining the highest standards in manufacturing and sourcing, ensuring that you receive exceptional products without compromising effectiveness. To learn more please complete the contact form with your inquiry.</p>
                <ContactUsButton />
            </div >
        </>
    )
}

const BecomeADistributor = () => {
    return (
        <>
            <div className='desktop-component flex flex-col md:flex-row py-12 gap-12'>
                <div className='w-[40%]'>
                    <Heading dashClassName='w-16' className='text-8xl !text-white' level={1}>BECOME A DISTRIBUTOR</Heading>
                    <p className='mb-4'>Join our flourishing brand by becoming a Jennychem distributor, where you can offer our quality UK manufactured products at competitive prices. Our comprehensive range is crafted in-house by our expert team collaborating with an innovative group and leveraging resources.</p>
                    <p>As a Jennychem distributor you will gain access to our expertise, enabling you to establish profitable and sustainable business. Our extensive product lineup encompasses over 400 unique chemical products and formulations to choose from. To learn more please complete the contact form with your inquiry.</p>
                    <ContactUsButton />
                </div>
                <div className='rounded-md overflow-hidden h-full w-full max-w-[60%]'>
                    <ReactPlayer height={"100%"} width={"100%"} controls url="https://cdn.shopify.com/videos/c/o/v/a486b379bd794422bdb095c1292f30c6.mp4"></ReactPlayer>
                </div>
            </div>
            <div className='mobile-component text-center py-6'>
                <Heading className='text-6xl !text-white mobile-component' level={1}>BULK SUPPLY</Heading >
                <div className='rounded-md overflow-hidden'>
                    <ReactPlayer height={"100%"} width={'auto'} controls url={"https://cdn.shopify.com/videos/c/o/v/a486b379bd794422bdb095c1292f30c6.mp4"}></ReactPlayer>
                </div>
                <p className='mt-6 mb-4'>Join our flourishing brand by becoming a Jennychem distributor, where you can offer our quality UK manufactured products at competitive prices. Our comprehensive range is crafted in-house by our expert team collaborating with an innovative group and leveraging resources.</p>
                <p className='mb-6'>As a Jennychem distributor you will gain access to our expertise, enabling you to establish profitable and sustainable business. Our extensive product lineup encompasses over 400 unique chemical products and formulations to choose from. To learn more please complete the contact form with your inquiry.</p>
                <ContactUsButton />
            </div>
        </>
    )
}

const ParallaxHeader: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        setScrollY(window.scrollY);
        if (window.scrollY > 200) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <>
            <div className="desktop-component fixed py-16 z-[-1] w-full min-h-[500px] bg-white" style={{ transform: `translateY(-${scrollY * 0.2}px)` }}>
                <Heading className='text-8xl text-center' level={1}><span className='text-jc-light-blue'>WHAT WE OFFER</span><br />WHEN IT COMES TO SERVICES</Heading>
            </div>
            <div className="mobile-component fixed py-16 z-[-1] w-full bg-white" style={{ transform: `translateY(-${scrollY * 0.2}px)` }}>
                <Heading className='text-8xl text-center' level={1}>WHAT WE OFFER</Heading>
            </div>
            <div className="mt-[300px] relative z-[5]">
                <div className='desktop-component relative z-[6]' style={{ background: 'linear-gradient(to bottom, rgba(9, 22, 56, 0) 5%, #091638 5%)' }}>
                    <img className="w-full h-auto absolute z-[7] inset-0 bg-gradient-to-b from-transparent via-transparent to-[#091638]" src="https://cdn.shopify.com/s/files/1/0032/5474/7185/files/daniel-sinoca-AANCLsb0sU0-unsplash2_STAGE_6.png?v=1727382822" />
                    <div className={`md:container pt-14 relative z-[10] text-white transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <PrivateLabelServices />
                        <DashDivider className='w-full h-[1px] opacity-50' />
                        <ChemicalBulkSupply />
                        <DashDivider className='w-full h-[1px] opacity-50' />
                        <BecomeADistributor />
                    </div>
                </div>
                <div className='mobile-component relative z-[6]' style={{ background: 'linear-gradient(to bottom, rgba(9, 22, 56, 0) 1%, #091638 1%)' }}>
                    <img className="w-full h-auto absolute z-[7] inset-0 bg-gradient-to-b from-transparent via-transparent to-[#091638]" src="https://cdn.shopify.com/s/files/1/0032/5474/7185/files/daniel-sinoca-AANCLsb0sU0-unsplash2_STAGE_6.png?v=1727382822" />
                    <div className={`px-6 pt-14 relative z-[10] text-white`}>
                        <PrivateLabelServices />
                        <DashDivider className='w-full h-[1px] opacity-50' />
                        <ChemicalBulkSupply />
                        <DashDivider className='w-full h-[1px] opacity-50' />
                        <BecomeADistributor />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ParallaxHeader;
