import { ProductFragment } from "storefrontapi.generated";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ProductOverview } from "./ProductOverview";
import TrustProductGallery from "../trustpilot/TrustPilotProductGalleryWidget";
import TrustProductReviews from "../trustpilot/TrustPilotProductGalleryWidget";

export function ProductTabs({
    product
}: { product: ProductFragment; }) {
    return (
        <Tabs defaultValue="overview" className='container py-10'>
            <TabsList className="flex w-full overflow-x-auto overflow-y-hidden">
                <TabsTrigger value="overview" className="min-w-[200px] flex-shrink-0 px-10">PRODUCT OVERVIEW</TabsTrigger>
                <TabsTrigger value="faq" className="min-w-[100px] flex-shrink-0 px-10">FAQs</TabsTrigger>
                {/* Only show when Video Demo available */}<TabsTrigger disabled value="demo" className='min-w-[100px] flex-shrink-0 px-10'>VIDEO DEMO</TabsTrigger>
                <TabsTrigger value="reviews" className="min-w-[100px] flex-shrink-0 px-10">REVIEWS</TabsTrigger>
                <TabsTrigger value="shipping" className="min-w-[200px] flex-shrink-0 px-10">SHIPPING & RETURNS</TabsTrigger>
                <TabsTrigger value="related" className="min-w-[200px] flex-shrink-0 px-10">RELATED PRODUCTS</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]' >
                <ProductOverview descriptionHtml={product.descriptionHtml} image={"https://placehold.co/600x400?text=No+Image"} />
            </TabsContent>
            {/* Only show when video demo is available<TabsContent value="demo" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]' >
            </TabsContent> */}
            <TabsContent value="faq" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
            </TabsContent>
            <TabsContent value="reviews" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
                <TrustProductReviews sku={product.selectedVariant?.sku || ""} />
            </TabsContent>
            <TabsContent value="shipping" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
            </TabsContent>
            <TabsContent value="related" className='bg-jc-light-grey py-5 px-10 shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
            </TabsContent>
        </Tabs>
    )
}