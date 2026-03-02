import React from 'react';
import { AppShell } from './components/layout/AppShell';
import { StatsRow } from './components/dashboard/StatsRow';
import { ActionTabs } from './components/dashboard/ActionTabs';
import { RewardsChart } from './components/dashboard/RewardsChart';
import { RewardsHistoryTable } from './components/dashboard/RewardsHistoryTable';
import { DemoModeBanner } from './components/dashboard/DemoModeBanner';
import { ErrorMessage } from './components/common/ErrorMessage';
import { useMotoChef } from './hooks/useMotoChef';
import { useStakeActions } from './hooks/useStakeActions';
import { useRewardsHistory } from './hooks/useRewardsHistory';
import { useMotoBalance } from './hooks/useMotoBalance';
import { DEMO_MODE } from './mock';

export default function App(): React.JSX.Element {
    const { data, loading, error } = useMotoChef();
    const { txStatus, stake, unstake, harvest, resetTxStatus } = useStakeActions();
    const chartHistory = useRewardsHistory(data);
    const { balance: walletBalance } = useMotoBalance();

    return (
        <AppShell>
            {DEMO_MODE && <DemoModeBanner />}

            {error && (
                <ErrorMessage message={`Data fetch error: ${error}`} />
            )}

            {/* Stats row */}
            <StatsRow data={data} loading={loading} />

            {/* Action tabs + chart side by side */}
            <div className="two-col">
                <ActionTabs
                    data={data}
                    walletBalance={walletBalance}
                    txStatus={txStatus}
                    onStake={stake}
                    onUnstake={unstake}
                    onHarvest={harvest}
                    onResetTx={resetTxStatus}
                />
                <RewardsChart data={chartHistory} loading={loading} />
            </div>

            {/* Full-width rewards history table */}
            <RewardsHistoryTable data={chartHistory} loading={loading} />
        </AppShell>
    );
}
