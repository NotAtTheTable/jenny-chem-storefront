import DashDivider from "~/components/foundational/DashDivider";
import EmailIcon from "~/assets/foundational/email_icon.svg";
import MessageIcon from "~/assets/foundational/message_icon.svg";
import { ArrowButton } from "~/components/foundational/ArrowButton";

import { json, type ActionFunctionArgs } from '@shopify/remix-oxygen';

export async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData();

    const fullName = formData.get("fullName");
    const email = formData.get("email");
    const orderNumber = formData.get("orderNumber");
    const message = formData.get("message");

    if (!fullName || !email || !orderNumber || !message) {
        throw new Error('All fields are required');
    }

    // Here you can handle the form submission logic, e.g., sending an email or saving to a database
    // For demonstration, we will just log the data
    console.log({
        fullName,
        email,
        orderNumber,
        message,
    });

    return json({ success: true, message: 'Your message has been sent successfully!' });
}


export default function Contact() {
    const data = {
        number: "01634 245666",
        email: "customerservices@jennychem.com",
        paragraph: 'Get in contact with a member of our team for any general enquiries or product support. Please note, any new orders placed over the phone will be charged an administration fee to process. Our opening hours are: Monday to Friday 9:00am to 5: 30pm, and Saturday 9:00am to 1:30pm.'
    };

    return (
        <div className="flex flex-row">
            <div className="w-[80%]">
                <iframe
                    width={"100%"}
                    height={"100%"}
                    style={{ border: 0 }}
                    loading="lazy"
                    src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJw70hYpU030cRICkT5XaCvjs&key=AIzaSyDq9Cf_nF6vcnU44kb80fyY3RUCZZw8BG8"
                />
            </div>
            <div className="w-4/10 m-10 max-w-lg m-w-sm">
                <h1 className="text-8xl text-jc-dark-blue font-display">
                    GET IN <br /> CONTACT
                    <span className="text-jc-light-blue">&#46;</span></h1>
                <div className='w-16 -mt-2 mb-4'><DashDivider className="h-[3px]" /></div>
                <div style={{ fontWeight: "700" }} className="flex items-center text-jc-dark-blue mb-3">
                    <img src={MessageIcon} className="mr-2" />
                    {data.number}
                </div>
                <div style={{ fontWeight: "700" }} className="flex items-center text-jc-dark-blue mb-4">
                    <img src={EmailIcon} className="mr-2" />
                    {data.email}
                </div>
                <div className="text-jc-dark-blue">
                    {data.paragraph}
                </div>
                <DashDivider className="!w-full h-[1px] opacity-25" />
                <form className="flex flex-col max-w-[unset]" aria-labelledby="contact-form" method="post" action="/contact">
                    <h2 id="contact-form" className="sr-only">Contact Form</h2>
                    <label className="mb-2 text-jc-dark-blue" htmlFor="fullName">FULL NAME</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        className="mb-4 p-2 bg-jc-light-grey-100 rounded border-none"
                        required
                        aria-required="true"
                        aria-describedby="fullNameHelp"
                    />

                    <label className="mb-2 text-jc-dark-blue" htmlFor="email">EMAIL*</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="mb-4 p-2 bg-jc-light-grey-100 rounded border-none"
                        required
                        aria-required="true"
                        aria-describedby="emailHelp"
                    />
                    <label className="mb-2 text-jc-dark-blue" htmlFor="orderNumber">ORDER NUMBER / PRODUCT SKU</label>
                    <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        className="mb-4 p-2 bg-jc-light-grey-100 rounded border-none"
                        required
                        aria-required="true"
                        aria-describedby="orderNumberHelp"
                    />
                    <label className="mb-2 text-jc-dark-blue" htmlFor="message">YOUR MESSAGE*</label>
                    <textarea
                        id="message"
                        name="message"
                        className="mb-4 p-2 bg-jc-light-grey-100 rounded border-none"
                        rows={4}
                        required
                        aria-required="true"
                        aria-describedby="messageHelp"
                    ></textarea>
                    <ArrowButton className="w-fit" type="submit" label={"Submit Message"} />
                </form>
            </div>
        </div>
    );
}