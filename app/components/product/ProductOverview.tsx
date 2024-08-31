import React from 'react';

interface ProductOverviewProps {
    image?: string;
    descriptionHtml?: string;
    howToStepList?: { value: string }[];
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({ image, descriptionHtml, howToStepList }) => {
    const columnCount = [image, descriptionHtml, howToStepList].filter(Boolean).length;
    const columnWidth = `w-full ${columnCount > 1 ? `md:w-1/${columnCount}` : ''}`;

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {image && (
                <div className={columnWidth}>
                    <img src={image} alt="ProductDescriptionImage" className="radius shadow-[0_0_5px_rgba(0,0,0,0.3)] w-full h-auto object-cover" />
                </div>
            )}

            {descriptionHtml && (
                <div className={columnWidth}>
                    <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                </div>
            )}

            {howToStepList && howToStepList.length > 0 && (
                <div className={columnWidth}>
                    <ul className="list-none p-0 relative">
                        {howToStepList.map((step, index) => (
                            <li key={step.value} className="flex items-start mb-4">
                                <div className="relative">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-jc-light-blue text-jc-dark-blue flex items-center justify-center mr-4 z-10 relative">
                                        {index + 1}
                                    </div>
                                    {index < howToStepList.length - 1 && (
                                        <div className="absolute top-8 left-4 w-0.5 h-full bg-jc-light-blue -z-10"></div>
                                    )}
                                </div>
                                <span>{step.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

