import React from 'react';
import { AppShell } from './components/layout/AppShell';
import { StatsRow } from './components/dashboard/StatsRow';
import { BitcoinStatsRow } from './components/dashboard/BitcoinStatsRow';
import { TokenInfoPills } from './components/dashboard/TokenInfoPills';
import { ActionTabs } from './components/dashboard/ActionTabs';
import { RewardsChart } from './components/dashboard/RewardsChart';
import { RewardsHistoryTable } from './components/dashboard/RewardsHistoryTable';
import { DemoModeBanner } from './components/dashboard/DemoModeBanner';
import { ErrorMessage } from './components/common/ErrorMessage';
import { useMotoswapStaking } from './hooks/useMotoswapStaking';
import { useStakeActions } from './hooks/useStakeActions';
import { useRewardsHistory } from './hooks/useRewardsHistory';
import { useMotoBalance } from './hooks/useMotoBalance';
import { useBitcoinStats } from './hooks/useBitcoinStats';
import { useMotoTokenInfo } from './hooks/useMotoTokenInfo';
import { DEMO_MODE } from './mock';

export default function App(): React.JSX.Element {
    const { data, loading, error } = useMotoswapStaking();
    const { txStatus, stake, unstake, claimRewards, resetTxStatus } = useStakeActions();
    const chartHistory = useRewardsHistory(data);
    const { balance: walletBalance } = useMotoBalance();
    const btcStats = useBitcoinStats();
    const tokenInfo = useMotoTokenInfo();

    return (
        <AppShell btcPriceUsd={btcStats.btcPriceUsd}>
            {DEMO_MODE && <DemoModeBanner />}

            {error && (
                <ErrorMessage message={`Data fetch error: ${error}`} />
            )}

            {/* MOTO OP20 token metadata pills */}
            <TokenInfoPills info={tokenInfo} />

            {/* MOTO staking stats */}
            <StatsRow data={data} loading={loading} />

            {/* Bitcoin network stats */}
            <BitcoinStatsRow stats={btcStats} />

            {/* Action tabs + chart side by side */}
            <div className="two-col">
                <ActionTabs
                    data={data}
                    walletBalance={walletBalance}
                    txStatus={txStatus}
                    onStake={stake}
                    onUnstake={unstake}
                    onClaimRewards={claimRewards}
                    onResetTx={resetTxStatus}
                />
                <RewardsChart data={chartHistory} loading={loading} />
            </div>

            {/* Full-width rewards history table */}
            <RewardsHistoryTable data={chartHistory} loading={loading} />
        </AppShell>
    );
}
