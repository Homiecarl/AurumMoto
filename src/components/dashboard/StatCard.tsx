import React from 'react';
import { Skeleton } from '../common/Skeleton';

interface StatCardProps {
    readonly label: string;
    readonly value: string;
    readonly sub?: string;
    readonly loading?: boolean;
    readonly highlight?: boolean;
}

export function StatCard({
    label,
    value,
    sub,
    loading = false,
    highlight = false,
}: StatCardProps): React.JSX.Element {
    return (
        <div className="stat-card animate-fade-slide-in" style={highlight ? { borderColor: 'var(--border-gold)', boxShadow: 'var(--shadow-gold)' } : undefined}>
            <div className="stat-card__label">{label}</div>
            {loading ? (
                <>
                    <Skeleton variant="value" />
                    {sub !== undefined && <Skeleton variant="text" width="50%" />}
                </>
            ) : (
                <>
                    <div className="stat-card__value data-value">{value}</div>
                    {sub && <div className="stat-card__sub">{sub}</div>}
                </>
            )}
        </div>
    );
}
