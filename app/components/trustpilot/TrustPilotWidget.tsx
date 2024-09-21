'use client'

import React from 'react';
const TrustBox = () => {
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
    return (
        <div
            ref={ref}
            className="trustpilot-widget"
            data-locale="en-GB"
            data-template-id="53aa8912dec7e10d38f59f36"
            data-businessunit-id="5d6ec855f44b80000110a29d"
            data-style-height="140px"
            data-text-color="#17255D"
            data-style-width="100%"
            data-theme="dark"
            data-stars="5"
            data-review-languages="en"
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
export default TrustBox;