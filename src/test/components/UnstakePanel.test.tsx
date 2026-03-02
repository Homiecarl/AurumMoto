import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnstakePanel } from '../../components/dashboard/UnstakePanel';

describe('UnstakePanel', () => {
    const defaultProps = {
        stakedBalance: 5_000_00000000n,
        pendingRewards: 1_42800000n,
        slashingFee: 14_28000n,
        onUnstake: vi.fn().mockResolvedValue(undefined),
        onClaimRewards: vi.fn().mockResolvedValue(undefined),
        isLoading: false,
    };

    it('shows staked balance as 5,000.00 MOTO', () => {
        render(<UnstakePanel {...defaultProps} />);
        expect(screen.getByText(/5,000\.00 MOTO/)).toBeInTheDocument();
    });

    it('unstake button is disabled when stakedBalance is 0n', () => {
        render(
            <UnstakePanel
                {...defaultProps}
                stakedBalance={0n}
            />,
        );
        const btn = screen.getByRole('button', { name: /unstake all moto/i });
        expect(btn).toBeDisabled();
    });

    it('unstake button is enabled when stakedBalance > 0', () => {
        render(<UnstakePanel {...defaultProps} />);
        const btn = screen.getByRole('button', { name: /unstake all moto/i });
        expect(btn).not.toBeDisabled();
    });

    it('shows slashing fee section when slashingFee > 0', () => {
        render(<UnstakePanel {...defaultProps} slashingFee={14_28000n} />);
        expect(screen.getByText(/early unstake fee/i)).toBeInTheDocument();
    });

    it('does not show slashing fee section when slashingFee is 0n', () => {
        render(<UnstakePanel {...defaultProps} slashingFee={0n} />);
        expect(screen.queryByText(/early unstake fee/i)).not.toBeInTheDocument();
    });

    it('shows claim button when pendingRewards > 0', () => {
        render(<UnstakePanel {...defaultProps} pendingRewards={1_42800000n} />);
        expect(screen.getByRole('button', { name: /claim/i })).toBeInTheDocument();
    });

    it('does not show claim button when pendingRewards is 0n', () => {
        render(<UnstakePanel {...defaultProps} pendingRewards={0n} />);
        expect(screen.queryByRole('button', { name: /claim/i })).not.toBeInTheDocument();
    });

    it('calls onUnstake when unstake button is clicked', async () => {
        const onUnstake = vi.fn().mockResolvedValue(undefined);
        const user = userEvent.setup();
        render(<UnstakePanel {...defaultProps} onUnstake={onUnstake} />);
        const btn = screen.getByRole('button', { name: /unstake all moto/i });
        await user.click(btn);
        await waitFor(() => {
            expect(onUnstake).toHaveBeenCalled();
        });
    });

    it('shows the slashing fee amount', () => {
        render(<UnstakePanel {...defaultProps} slashingFee={14_28000n} />);
        // slashingFee = 14_28000n = 0.01428 MOTO — check it's present in the fee display
        const feeEl = screen.getByText(/-.*MOTO/);
        expect(feeEl).toBeInTheDocument();
    });

    it('shows net receive amount (stakedBalance - slashingFee)', () => {
        const stakedBalance = 5_000_00000000n;
        const slashingFee = 14_28000n;
        render(
            <UnstakePanel
                {...defaultProps}
                stakedBalance={stakedBalance}
                slashingFee={slashingFee}
            />,
        );
        // Net receive = 4999.9857... MOTO — the row shows "You will receive"
        expect(screen.getByText(/you will receive/i)).toBeInTheDocument();
        // The net amount should be present somewhere in the panel
        // formatMoto(netReceive) ≈ 4,999.985720
        const netFormatted = '4,999.98572';
        expect(screen.getByText(new RegExp(netFormatted.replace('.', '\\.').replace(',', ',')))).toBeInTheDocument();
    });
});
