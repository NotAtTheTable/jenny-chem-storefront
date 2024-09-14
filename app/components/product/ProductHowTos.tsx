import React from 'react';
import { HowToStepList } from './ProductTabs';
import ReactPlayer from 'react-player';

interface ProductTodosProps {
    howToVideoUrl?: string;
    howToStepList?: HowToStepList
}

export const ProductHowTos: React.FC<ProductTodosProps> = ({ howToVideoUrl, howToStepList }) => {

    const howToStepsPresent = howToStepList && howToStepList.steps.length > 0;

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {howToVideoUrl && (
                <div className={`${howToStepsPresent ? 'flex-grow' : 'w-full h-fit'} rounded-lg overflow-hidden shadow-[0_0_5px_rgba(0,0,0,0.3)]`}>
                    <ReactPlayer
                        url={howToVideoUrl}
                        height={howToStepsPresent ? "100%" : "700px"}
                        width={howToStepsPresent ? "" : "100%"}
                    />
                </div>
            )}

            {howToStepsPresent && (
                <div className={`flex-1 md:min-w-3/10`}>
                    <ul className="list-none p-0 relative">
                        {howToStepList.steps.map((step, index) => (
                            <li key={step.value} className={`flex items-center ${index === howToStepList.steps.length - 1 ? 'm-0' : 'mb-4'}`}>
                                <div className="relative">
                                    <div style={{ letterSpacing: '1px' }} className="pt-1 pl-[0.5px] flex-shrink-0 w-[45px] h-[45px] rounded-full bg-jc-dark-blue text-white font-display text-[28px] flex items-center justify-center mr-4 z-10 relative">
                                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                    </div>
                                    {index < howToStepList.steps.length - 1 && (
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

