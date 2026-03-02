import React from 'react';
import { Button } from '../common/Button';
import { formatMoto } from '../../utils/formatting';

interface UnstakePanelProps {
    readonly stakedBalance: bigint;
    readonly pendingRewards: bigint;
    readonly slashingFee: bigint;
    readonly onUnstake: () => Promise<void>;
    readonly onClaimRewards: () => Promise<void>;
    readonly isLoading: boolean;
}

export function UnstakePanel({
    stakedBalance,
    pendingRewards,
    slashingFee,
    onUnstake,
    onClaimRewards,
    isLoading,
}: UnstakePanelProps): React.JSX.Element {
    const hasStake = stakedBalance > 0n;
    const hasRewards = pendingRewards > 0n;
    const hasSlashing = slashingFee > 0n;
    const netReceive = hasStake && hasSlashing ? stakedBalance - slashingFee : stakedBalance;

    return (
        <div className="action-panel">
            <div className="action-panel__balance-hint">
                <span>Staked balance</span>
                <span>{formatMoto(stakedBalance)} MOTO</span>
            </div>

            {hasSlashing && (
                <div className="slashing-warning">
                    <div className="slashing-warning__row">
                        <span>Early unstake fee</span>
                        <span className="slashing-warning__fee">
                            -{formatMoto(slashingFee)} MOTO
                        </span>
                    </div>
                    <div className="slashing-warning__row">
                        <span>You will receive</span>
                        <span>{formatMoto(netReceive)} MOTO</span>
                    </div>
                    <p className="slashing-warning__note">
                        Fee decreases the longer you hold. Claim rewards to reset.
                    </p>
                </div>
            )}

            <Button
                variant="danger"
                size="xl"
                onClick={onUnstake}
                disabled={!hasStake || isLoading}
                loading={isLoading}
                aria-label="Unstake all MOTO tokens"
            >
                Unstake All MOTO
            </Button>

            {hasRewards && (
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={onClaimRewards}
                    disabled={isLoading}
                    loading={isLoading}
                    aria-label={`Claim ${formatMoto(pendingRewards)} MOTO rewards`}
                >
                    Claim {formatMoto(pendingRewards)} MOTO
                </Button>
            )}
        </div>
    );
}
