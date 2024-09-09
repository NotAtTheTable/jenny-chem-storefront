import { Video as VideoElement } from '@shopify/hydrogen';
import { Video } from '@shopify/hydrogen/storefront-api-types';
import React from 'react';

interface ProductTodosProps {
    video?: Video;
    howToStepList?: { value: string }[];
}

export const ProductHowTos: React.FC<ProductTodosProps> = ({ video, howToStepList }) => {
    return (
        <div className="flex flex-col md:flex-row gap-6">
            {video && (
                <div className={howToStepList && howToStepList.length > 0 ? 'md:w-3/5' : 'w-full'}>
                    <VideoElement src={""} data={video} className="radius shadow-[0_0_5px_rgba(0,0,0,0.3)] w-full h-auto object-cover" />
                </div>
            )}

            {howToStepList && howToStepList.length > 0 && (
                <div className={video ? 'md:w-2/5' : 'w-full'}>
                    <ul className="list-none p-0 relative">
                        {howToStepList.map((step, index) => (
                            <li key={step.value} className="flex items-center mb-4">
                                <div className="relative">
                                    <div style={{ letterSpacing: '1px' }} className="pt-1 pl-[0.5px] flex-shrink-0 w-[45px] h-[45px] rounded-full bg-jc-dark-blue text-white font-display text-[28px] flex items-center justify-center mr-4 z-10 relative">
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </div>
                                    {index < howToStepList.length - 1 && (
                                        <div className="absolute top-[45px] left-[23px] transform -translate-x-1/2 w-[2.5px] h-full bg-jc-dark-blue"></div>
                                    )}
                                </div>
                                <span className='text-jc-dark-blue'>{step.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

