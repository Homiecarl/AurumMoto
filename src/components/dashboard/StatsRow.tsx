import React from 'react';
import { StatCard } from './StatCard';
import { formatMoto } from '../../utils/formatting';
import { useAPY } from '../../hooks/useAPY';
import type { StakingData } from '../../types/staking';

interface StatsRowProps {
    readonly data: StakingData | null;
    readonly loading: boolean;
}

export function StatsRow({ data, loading }: StatsRowProps): React.JSX.Element {
    const { apyDisplay } = useAPY(data);

    const stakedDisplay = data ? formatMoto(data.userInfo.amount) : '0.00';
    const rewardsDisplay = data ? formatMoto(data.pendingRewards) : '0.00';
    const tvlDisplay = data?.poolInfo.lpSupply ? formatMoto(data.poolInfo.lpSupply) : '—';

    return (
        <div className="stats-row stagger-children">
            <StatCard
                label="My Staked MOTO"
                value={stakedDisplay}
                sub="Total deposited"
                loading={loading && !data}
                highlight
            />
            <StatCard
                label="Pending Rewards"
                value={rewardsDisplay}
                sub="Claimable MOTO"
                loading={loading && !data}
            />
            <StatCard
                label="Pool APY"
                value={apyDisplay}
                sub="Based on current emissions"
                loading={loading && !data}
            />
            <StatCard
                label="Total Pool TVL"
                value={tvlDisplay}
                sub="MOTO staked in pool"
                loading={loading && !data}
            />
        </div>
    );
}
