import { useEffect } from "react";
import { ProductFragment } from "storefrontapi.generated";
import { FAQList } from "./ProductTabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Plus } from "lucide-react";

export function ProductFAQs({ faqList }: { faqList: FAQList }) {

    return (
        <div className="flex flex-col md:flex-row gap-6">

            <div className={'md:w-3/5'}>
                <Accordion collapsible type="single" className="gap-3 flex flex-col">
                    {faqList.faqs.map(({ question, answer }, index) => (
                        <AccordionItem key={index} value={`value_${index}`} className="[&[data-state=open]]:bg-jc-dark-blue [&[data-state=open]]:text-white text-jc-dark-blue bg-white rounded-lg px-4 shadow">
                            <AccordionTrigger hideDefaultToggle
                                className="flex flex-1 items-center justify-between py-3 font-medium"
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

            <div className={'md:w-2/5'}>
                <div
                    className="h-full rounded-lg shadow-md bg-cover bg-center"
                    style={{ backgroundImage: "url('https://placehold.co/400')" }}
                    role="img"
                    aria-label="FAQ Image"
                >
                </div>
            </div>

        </div>
    )
}
