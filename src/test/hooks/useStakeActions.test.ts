import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Hoisted mock for sendTransaction
const mockSendTx = vi.hoisted(() =>
    vi.fn().mockResolvedValue({ transactionId: 'txhash123' }),
);

vi.mock('../../services/ContractService', () => ({
    ContractService: {
        getInstance: vi.fn(() => ({
            getMotoswapStaking: vi.fn(() => ({
                stake: vi.fn(() =>
                    Promise.resolve({ sendTransaction: mockSendTx }),
                ),
                unstake: vi.fn(() =>
                    Promise.resolve({ sendTransaction: mockSendTx }),
                ),
                claimRewards: vi.fn(() =>
                    Promise.resolve({ sendTransaction: mockSendTx }),
                ),
            })),
        })),
    },
}));

vi.mock('@btc-vision/walletconnect', () => ({
    useWalletConnect: vi.fn(() => ({ walletAddress: 'bc1test' })),
}));

vi.mock('@btc-vision/bitcoin', () => ({
    networks: { opnetTestnet: {} },
}));

// Import after mocks are set up
import { useStakeActions } from '../../hooks/useStakeActions';
import { useWalletConnect } from '@btc-vision/walletconnect';

describe('useStakeActions', () => {
    beforeEach(() => {
        vi.mocked(useWalletConnect).mockReturnValue({ walletAddress: 'bc1test' } as ReturnType<typeof useWalletConnect>);
        mockSendTx.mockResolvedValue({ transactionId: 'txhash123' });
    });

    it("initial txStatus.state is 'idle'", () => {
        const { result } = renderHook(() => useStakeActions());
        expect(result.current.txStatus.state).toBe('idle');
    });

    it("after stake(), txStatus.state becomes 'success' and txHash is 'txhash123'", async () => {
        const { result } = renderHook(() => useStakeActions());

        await act(async () => {
            await result.current.stake(1_00000000n);
        });

        await waitFor(() => {
            expect(result.current.txStatus.state).toBe('success');
        });

        expect(result.current.txStatus.txHash).toBe('txhash123');
    });

    it("after unstake(), txStatus.state becomes 'success'", async () => {
        const { result } = renderHook(() => useStakeActions());

        await act(async () => {
            await result.current.unstake();
        });

        await waitFor(() => {
            expect(result.current.txStatus.state).toBe('success');
        });
    });

    it("after claimRewards(), txStatus.state becomes 'success'", async () => {
        const { result } = renderHook(() => useStakeActions());

        await act(async () => {
            await result.current.claimRewards();
        });

        await waitFor(() => {
            expect(result.current.txStatus.state).toBe('success');
        });
    });

    it("resetTxStatus() returns state to 'idle'", async () => {
        const { result } = renderHook(() => useStakeActions());

        await act(async () => {
            await result.current.stake(1_00000000n);
        });

        await waitFor(() => {
            expect(result.current.txStatus.state).toBe('success');
        });

        act(() => {
            result.current.resetTxStatus();
        });

        expect(result.current.txStatus.state).toBe('idle');
    });

    it("sets error state immediately when walletAddress is empty", async () => {
        vi.mocked(useWalletConnect).mockReturnValue({ walletAddress: '' } as ReturnType<typeof useWalletConnect>);

        const { result } = renderHook(() => useStakeActions());

        await act(async () => {
            await result.current.stake(1_00000000n);
        });

        expect(result.current.txStatus.state).toBe('error');
    });
});
