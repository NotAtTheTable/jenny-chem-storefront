import React from 'react';
import DashDivider from './DashDivider';
import { cn } from '~/lib/utils';

interface HeadingProps {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children?: React.ReactNode;
    className?: string;
    dashClassName?: string;
}

const Heading: React.FC<HeadingProps> = ({ level, children, className, dashClassName }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    return <div>
        <Tag className={className} variants={''} store-url={''}>{children as any}</Tag>
        <div className={dashClassName}><DashDivider className={cn("-mt-1 mb-4 h-[3px]", dashClassName)} /></div>
    </div>;
};

export default Heading;
