import React from 'react';
import { StatCard } from './StatCard';
import type { BitcoinStats } from '../../hooks/useBitcoinStats';

interface BitcoinStatsRowProps {
    readonly stats: BitcoinStats;
}

export function BitcoinStatsRow({ stats }: BitcoinStatsRowProps): React.JSX.Element {
    const { btcPriceUsd, blockHeight, fees } = stats;

    const priceDisplay =
        btcPriceUsd !== null
            ? `$${btcPriceUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
            : '—';

    const blockDisplay =
        blockHeight !== null ? `#${blockHeight.toLocaleString('en-US')}` : '—';

    const feesDisplay = fees !== null ? `${fees.fastest} sat/vB` : '—';
    const feeMedDisplay = fees !== null ? `${fees.medium} / ${fees.slow}` : null;

    return (
        <section className="btc-stats-section">
            <div className="section-heading">Bitcoin Network</div>
            <div className="stats-row stagger-children">
                <StatCard
                    label="BTC Price"
                    value={priceDisplay}
                    sub="USD via CoinGecko"
                    loading={btcPriceUsd === null}
                />
                <StatCard
                    label="Block Height"
                    value={blockDisplay}
                    sub="OPNet Testnet (Signet)"
                    loading={blockHeight === null}
                />
                <StatCard
                    label="Priority Fee"
                    value={feesDisplay}
                    sub={feeMedDisplay ? `Med / Slow: ${feeMedDisplay} sat/vB` : 'BTC Mainnet'}
                    loading={fees === null}
                />
            </div>
        </section>
    );
}
