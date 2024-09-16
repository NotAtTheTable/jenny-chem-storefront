import { FAQList } from "./ProductTabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Plus } from "lucide-react";
import { Image } from "@shopify/hydrogen";

export function ProductFAQs({ faqList }: { faqList: FAQList }) {

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className={'md:w-3/5'}>
                <Accordion collapsible type="single" className="gap-3 flex flex-col">
                    {faqList.faqs.map(({ question, answer }, index) => (
                        <AccordionItem key={index} value={`value_${index}`} className="[&[data-state=open]]:bg-jc-dark-blue [&[data-state=open]]:text-white text-jc-dark-blue bg-white rounded-lg px-4 shadow">
                            <AccordionTrigger hideDefaultToggle
                                className="flex flex-1 items-center justify-between py-3 font-medium text-left"
                                customDataStateClass="[&[data-state=open]>div>svg]:rotate-45 [&[data-state=open]>div>svg]:text-jc-light-blue"
                            >
                                <div key={index} className='flex items-center w-full justify-between flex-row'>
                                    <div style={{ fontWeight: '700' }} className='font-bold'>{question}</div>
                                    <Plus className="rotate-icon" />
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className='pt-3 border-t-2 border-jc-light-blue '>
                                <div>{answer}</div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            <div
                className="relative min-h-[250px] rounded-lg shadow-md bg-cover bg-center md:w-2/5 desktop-component"
                style={{ backgroundImage: "url('https://placehold.co/400')" }}
                role="img"
                aria-label="FAQ Image"
            >
                <div className="w-[400px] absolute top-1/2 left-1/2 transform -translate-x-[230px] -translate-y-[90px]">
                    <Image
                        data={{
                            altText: "Product FAQ image",
                            url: "https://cdn.shopify.com/s/files/1/0032/5474/7185/files/jennychem_logo_24.png?v=1720257895",
                            width: 400,
                        }}
                        sizes="(min-width: 45em) 50vw, 100vw"
                        aspectRatio="27/10"
                    />
                </div>
            </div>
        </div>
    )
}
