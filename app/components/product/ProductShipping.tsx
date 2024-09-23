import Warning from "@/assets/foundational/warning.svg"

export function ProductShipping() {

    return (
        <div className="flex md:flex-row flex-col gap-4 md:gap-6">
            <img src={"https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Shipping_and_return.png?v=1725394077"} className="desktop-only w-[300px] flex-shrink-0" />
            <img src={"https://cdn.shopify.com/s/files/1/0032/5474/7185/files/Shipping_and_return_mobile.png?v=1727120568"} className="mobile-only w-full" />
            <div className="flex md:flex-row flex-col flex-grow gap-6 md:text-left text-center">
                <div className="md:w-1/2">
                    <h3 className="text-jc-light-blue text-lg mb-2">SHIPPING INFORMATION</h3>
                    <p className="text-sm text-jc-dark-blue mb-3">Orders are shipped using the DHL&#44; Yodel&#44; Royal Mail&#44; DPD & APC network and the delivery rates depend on order amount and location within the UK&#44; Not all orders will fall under the free delivery option.</p>
                    <p className="text-sm text-jc-dark-blue mb-3">Shipping fees include handling and packing fees as well as postage costs&#44; Handling fees are fixed&#44; whereas transport fees vary according to the total weight of the shipment.</p>
                    <table className="w-full border-collapse my-4">
                        <thead>
                            <tr className="bg-jc-dark-blue text-white text-sm">
                                <th className="border border-jc-dark-blue p-2">LOCATION&#58;</th>
                                <th className="border border-jc-dark-blue p-2">ORDER VALUE&#58;</th>
                                <th className="border border-jc-dark-blue p-2">DELIVERY COST&#58;</th>
                            </tr>
                        </thead>
                        <tbody className="text-jc-dark-blue text-sm text-center">
                            <tr>
                                <td className="border border-jc-dark-blue p-2 text-xs">UK Mainland Areas<br /> &#40;3&#45;5 Working Days&#41;</td>
                                <td className="border border-jc-dark-blue p-2">£50</td>
                                <td className="border font-bold border-jc-dark-blue p-2">FREE&#42;</td>
                            </tr>
                            <tr>
                                <td className="border border-jc-dark-blue p-2 text-xs">Scottish Highlands<br /> &#40;3&#45;5 Working Days&#41;</td>
                                <td className="border font-bold border-jc-dark-blue p-2 ">ANY</td>
                                <td className="border font-bold border-jc-dark-blue p-2">&pound;6&#46;50&#43;</td>
                            </tr>
                            <tr>
                                <td className="border border-jc-dark-blue p-2 text-xs">Scottish Islands<br /> &#40;3&#45;5 Working Days&#41;</td>
                                <td className="border font-bold border-jc-dark-blue p-2">ANY</td>
                                <td className="border font-bold border-jc-dark-blue p-2">&pound;10&#43;</td>
                            </tr>
                        </tbody>

                    </table>
                    <p className="text-sm text-jc-dark-blue mb-3">*Delivery charges apply on hazchem products and orders over 100kg. Shipping is calculated at the checkout.</p>
                    <h3 className="text-jc-light-blue text-lg my-2">HAZCHEM DELIVERY</h3>
                    <div className="flex flex-row items-center gap-2">
                        <img src={Warning} />
                        <p className="text-sm text-jc-dark-blue">
                            Some items will always have a delivery fee and are shipped through the Hazchem Network. The delivery cost is automatically calculated at checkout.
                        </p>
                    </div>
                </div>
                <div className="md:w-1/2">
                    <h3 className="text-jc-light-blue text-lg mb-2">RETURNS INFORMATION</h3>
                    <p className="text-sm text-jc-dark-blue mb-3">We will notify you once we&#39;ve received and inspected your return&#44; and let you know if the refund was approved or not&#44; If approved&#44; you&#39;ll be automatically refunded on your original payment method&#44; Please remember it can take some time for your bank or credit card company to process the refund.</p>
                    <h3 className="text-jc-light-blue text-lg mb-2">DAMAGED ITEMS</h3>
                    <p className="text-sm text-jc-dark-blue mb-3">Please inspect your order upon reception and contact us immediately if the item is defective. damaged or if you receive the wrong item. so that we can evaluate the issue and make it right.</p>
                    <h3 className="text-jc-light-blue text-lg mb-2">EXCEPTIONS &amp; NON-RETURNABLE ITEMS&#58;</h3>
                    <p className="text-sm text-jc-dark-blue mb-3">Certain types of items cannot be returned&#44; We also do not accept returns for hazardous materials&#44; flammable liquids&#44; or gases&#44; Please get in touch if you have questions or concerns about your specific item.</p>
                    <p className="text-sm text-jc-dark-blue mb-3">Unfortunately&#44; we cannot accept returns on sale items or gift cards&#44; Offer &#47; Discount are excluded from the returns policy unless returned within 7 days of the order being placed.</p>
                    <h3 className="text-jc-light-blue text-lg mb-2">EXCHANGES</h3>
                    <p className="text-sm text-jc-dark-blue mb-3">The fastest way to ensure you get what you want is to return the item you have&#44; and once the return is accepted&#44; make a separate purchase for the new item.</p>
                </div>
            </div>
        </div>
    )
}
