import React from 'react';

interface PricePillProps {
    readonly priceUsd: number | null;
}

export function PricePill({ priceUsd }: PricePillProps): React.JSX.Element {
    const display =
        priceUsd !== null
            ? `$${priceUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
            : '—';

    return (
        <div className="price-pill">
            <span className="price-pill__btc">&#8383;</span>
            <span className="price-pill__value">{display}</span>
        </div>
    );
}
