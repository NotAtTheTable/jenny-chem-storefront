'use client'

import React, { useEffect } from 'react';
const TrustProductMini = ({ sku }: { sku: string }) => {
    // Create a reference to the <div> element which will represent the TrustBox
    const ref = React.useRef(null);
    React.useEffect(() => {
        // If window.Trustpilot is available it means that we need to load the TrustBox from our ref.
        // If it's not, it means the script you pasted into <head /> isn't loaded just yet.
        // When it is, it will automatically load the TrustBox.
        if ((window as any).Trustpilot) {
            (window as any).Trustpilot.loadFromElement(ref.current, true);
        }
    }, []);

    useEffect(() => {
    }, [sku])
    return (
        <div
            ref={ref}
            className="trustpilot-widget"
            data-locale="en-GB"
            data-template-id="54d39695764ea907c0f34825"
            data-businessunit-id="5d6ec855f44b80000110a29d"
            data-style-height="24px"
            data-style-width="100%"
            data-text-color="#17255D"
            data-theme="light"
            data-sku={sku || ""}
            data-no-reviews="show"
            data-scroll-to-list="true"
            data-style-alignment="center"
        >
            <a
                href="https://uk.trustpilot.com/review/jennychem.com"
                target="_blank"
                rel="noopener"
            >
                Trustpilot
            </a>
        </div>
    );
};
export default TrustProductMini;