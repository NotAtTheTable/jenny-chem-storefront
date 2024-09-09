import React from 'react';

interface ProductOverviewProps {
    image?: string;
    descriptionHtml?: string;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({ image, descriptionHtml }) => {
    return (
        <div className="flex flex-col md:flex-row gap-6">
            {image && (
                <div className="md:w-3/5">
                    <img src={image} alt="ProductDescriptionImage" className="radius shadow-[0_0_5px_rgba(0,0,0,0.3)] w-full h-auto object-cover" />
                </div>
            )}

            {descriptionHtml && (
                <div className={image ? 'md:w-2/5' : 'w-full'}>
                    <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                </div>
            )}
        </div>
    );
};

