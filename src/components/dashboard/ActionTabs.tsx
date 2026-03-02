import React, { useState } from 'react';
import { StakePanel } from './StakePanel';
import { UnstakePanel } from './UnstakePanel';
import type { StakingData } from '../../types/staking';
import type { TxStatus } from '../../types/staking';
import { TxStatusModal } from '../common/TxStatusModal';

type ActiveTab = 'stake' | 'unstake';

interface ActionTabsProps {
    readonly data: StakingData | null;
    readonly walletBalance: bigint;
    readonly txStatus: TxStatus;
    readonly onStake: (amount: bigint) => Promise<void>;
    readonly onUnstake: () => Promise<void>;
    readonly onClaimRewards: () => Promise<void>;
    readonly onResetTx: () => void;
}

export function ActionTabs({
    data,
    walletBalance,
    txStatus,
    onStake,
    onUnstake,
    onClaimRewards,
    onResetTx,
}: ActionTabsProps): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<ActiveTab>('stake');
    const isLoading = txStatus.state === 'simulating' || txStatus.state === 'pending';

    return (
        <>
            <div className="card">
                <div className="tabs" role="tablist" aria-label="Staking actions">
                    <button
                        className={`tab-btn${activeTab === 'stake' ? ' active' : ''}`}
                        role="tab"
                        aria-selected={activeTab === 'stake'}
                        aria-controls="panel-stake"
                        onClick={() => setActiveTab('stake')}
                    >
                        Stake
                    </button>
                    <button
                        className={`tab-btn${activeTab === 'unstake' ? ' active' : ''}`}
                        role="tab"
                        aria-selected={activeTab === 'unstake'}
                        aria-controls="panel-unstake"
                        onClick={() => setActiveTab('unstake')}
                    >
                        Unstake
                    </button>
                </div>

                <div style={{ marginTop: 'var(--space-5)' }}>
                    {activeTab === 'stake' ? (
                        <div id="panel-stake" role="tabpanel">
                            <StakePanel
                                walletBalance={walletBalance}
                                onStake={onStake}
                                isLoading={isLoading}
                            />
                        </div>
                    ) : (
                        <div id="panel-unstake" role="tabpanel">
                            <UnstakePanel
                                stakedBalance={data?.stakedBalance ?? 0n}
                                pendingRewards={data?.pendingRewards ?? 0n}
                                slashingFee={data?.slashingFee ?? 0n}
                                onUnstake={onUnstake}
                                onClaimRewards={onClaimRewards}
                                isLoading={isLoading}
                            />
                        </div>
                    )}
                </div>
            </div>

            <TxStatusModal status={txStatus} onClose={onResetTx} />
        </>
    );
}
