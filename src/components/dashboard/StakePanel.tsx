import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ErrorMessage } from '../common/ErrorMessage';
import { formatMoto } from '../../utils/formatting';
import { validateAmount } from '../../utils/validation';
import { scaleUp } from '../../utils/bigint';
import { MOTO_DECIMALS } from '../../config/constants';

interface StakePanelProps {
    readonly walletBalance: bigint;
    readonly onStake: (amount: bigint) => Promise<void>;
    readonly isLoading: boolean;
}

export function StakePanel({ walletBalance, onStake, isLoading }: StakePanelProps): React.JSX.Element {
    const [amount, setAmount] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleMax = (): void => {
        const display = formatMoto(walletBalance);
        setAmount(display.replace(/,/g, ''));
        setError(null);
    };

    const handleStake = async (): Promise<void> => {
        const result = validateAmount(amount, walletBalance);
        if (!result.valid) {
            setError(result.error);
            return;
        }
        setError(null);
        await onStake(result.value);
        setAmount('');
    };

    const parsedValue = amount ? ((): bigint => {
        try { return scaleUp(amount, MOTO_DECIMALS); } catch { return 0n; }
    })() : 0n;

    const isValid = parsedValue > 0n && parsedValue <= walletBalance;

    return (
        <div className="action-panel">
            <div className="action-panel__balance-hint">
                <span>Available balance</span>
                <span onClick={handleMax} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleMax()}>
                    {formatMoto(walletBalance)} MOTO
                </span>
            </div>

            <Input
                label="Amount to Stake"
                value={amount}
                onChange={(v) => { setAmount(v); setError(null); }}
                onMax={handleMax}
                error={error}
                placeholder="0.00"
                disabled={isLoading}
            />

            <Button
                variant="primary"
                size="xl"
                onClick={handleStake}
                disabled={!isValid || isLoading}
                loading={isLoading}
                aria-label="Stake MOTO tokens"
            >
                Stake MOTO
            </Button>

            <ErrorMessage message={error} />
        </div>
    );
}
