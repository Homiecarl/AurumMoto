import React from 'react';

interface SkeletonProps {
    readonly variant?: 'text' | 'value' | 'full' | 'chart';
    readonly width?: string;
    readonly height?: string;
    readonly className?: string;
}

export function Skeleton({
    variant = 'text',
    width,
    height,
    className = '',
}: SkeletonProps): React.JSX.Element {
    const classes = [
        'skeleton',
        variant !== 'chart' ? `skeleton--${variant}` : 'chart-skeleton',
        className,
    ].filter(Boolean).join(' ');

    const style: React.CSSProperties = {};
    if (width) style.width = width;
    if (height) style.height = height;

    return <div className={classes} style={style} aria-hidden="true" />;
}
