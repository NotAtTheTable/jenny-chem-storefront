import { ProductCardPreviewFragment, ProductFragment, ProductRecommendationsQuery } from "storefrontapi.generated";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ProductOverview } from "./ProductOverview";
import { ProductShipping } from "./ProductShipping";
import { ProductFAQs } from "./ProductFAQs";
import { ProductHowTos } from "./ProductHowTos";
import ProductRecommendations from "./ProductRecommendations";
import { Suspense, useState } from "react";
import { Await } from "@remix-run/react";

export type HowToStepList = {
    steps: { value: string }[]
}

export type FAQList = {
    faqs: {
        question: string;
        answer: string;
    }[]
}

interface ProductTabsProps {
    product: ProductFragment;
    productRecommendations: ProductRecommendationsQuery;
}

export function ProductTabs({
    product,
    productRecommendations
}: ProductTabsProps) {

    const howToStepList = (JSON.parse(product.howToSteps?.value || "{\"steps\":[]}")) as HowToStepList;
    const faqList = (JSON.parse(product.faqs?.value || "{\"faqs\":[]}")) as FAQList;
    return (
        <Tabs defaultValue="overview" className='container py-10'>
            <TabsList className="flex w-full overflow-x-auto overflow-y-hidden">
                <TabsTrigger value="overview" className="min-w-[200px] flex-shrink-0 px-10">PRODUCT OVERVIEW</TabsTrigger>
                <TabsTrigger disabled={howToStepList.steps.length > 0} value="howto" className="min-w-[100px] flex-shrink-0 px-10">HOW TO USE</TabsTrigger>
                <TabsTrigger disabled={faqList.faqs.length > 0} value="faq" className='min-w-[100px] flex-shrink-0 px-10'>FAQS</TabsTrigger>
                <TabsTrigger value="shipping" className="min-w-[200px] flex-shrink-0 px-10">SHIPPING & RETURNS</TabsTrigger>
                <TabsTrigger value="related" className="min-w-[200px] flex-shrink-0 px-10">RELATED PRODUCTS</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className='bg-jc-light-grey p-6 shadow-[0_0_5px_rgba(0,0,0,0.3)]' >
                <ProductOverview descriptionHtml={product.descriptionHtml} overviewMedia={product.overviewMedia} />
            </TabsContent>
            {(howToStepList.steps.length > 0 || product.howToVideoUrl?.value) &&
                <TabsContent value="howto" className='bg-jc-light-grey p-6 shadow-[0_0_5px_rgba(0,0,0,0.3)]' >
                    <ProductHowTos howToStepList={howToStepList} howToVideoUrl={product.howToVideoUrl?.value} />
                </TabsContent>
            }
            {faqList.faqs.length > 0 &&
                <TabsContent value="faq" className='bg-jc-light-grey p-6 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
                    <ProductFAQs faqList={faqList} />
                </TabsContent>
            }
            <TabsContent value="shipping" className='bg-jc-light-grey p-6 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
                <ProductShipping />
            </TabsContent>
            <TabsContent value="related" className='bg-jc-light-grey p-6 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
                <ProductRecommendations productRecommendations={productRecommendations.productRecommendations} />
            </TabsContent>
        </Tabs>
    )
}