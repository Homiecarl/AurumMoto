import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { formatMoto } from '../../utils/formatting';
import { validateAmount } from '../../utils/validation';
import { scaleUp } from '../../utils/bigint';
import { MOTO_DECIMALS } from '../../config/constants';

interface UnstakePanelProps {
    readonly stakedBalance: bigint;
    readonly pendingRewards: bigint;
    readonly onUnstake: (amount: bigint) => Promise<void>;
    readonly onHarvest: () => Promise<void>;
    readonly isLoading: boolean;
}

export function UnstakePanel({
    stakedBalance,
    pendingRewards,
    onUnstake,
    onHarvest,
    isLoading,
}: UnstakePanelProps): React.JSX.Element {
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleMax = (): void => {
        const display = formatMoto(stakedBalance);
        setAmount(display.replace(/,/g, ''));
        setError(null);
    };

    const handleUnstake = async (): Promise<void> => {
        const result = validateAmount(amount, stakedBalance);
        if (!result.valid) {
            setError(result.error);
            return;
        }
        setError(null);
        await onUnstake(result.value);
        setAmount('');
    };

    const parsedValue = amount ? ((): bigint => {
        try { return scaleUp(amount, MOTO_DECIMALS); } catch { return 0n; }
    })() : 0n;

    const isValid = parsedValue > 0n && parsedValue <= stakedBalance;

    return (
        <div className="action-panel">
            <div className="action-panel__balance-hint">
                <span>Staked balance</span>
                <span onClick={handleMax} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleMax()}>
                    {formatMoto(stakedBalance)} MOTO
                </span>
            </div>

            <Input
                label="Amount to Unstake"
                value={amount}
                onChange={(v) => { setAmount(v); setError(null); }}
                onMax={handleMax}
                error={error}
                placeholder="0.00"
                disabled={isLoading}
            />

            <Button
                variant="danger"
                size="xl"
                onClick={handleUnstake}
                disabled={!isValid || isLoading}
                loading={isLoading}
                aria-label="Unstake MOTO tokens"
            >
                Unstake MOTO
            </Button>

            {pendingRewards > 0n && (
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={onHarvest}
                    disabled={isLoading}
                    loading={isLoading}
                    aria-label={`Harvest ${formatMoto(pendingRewards)} MOTO rewards`}
                >
                    Harvest {formatMoto(pendingRewards)} MOTO
                </Button>
            )}

            <ErrorMessage message={error} />
        </div>
    );
}
