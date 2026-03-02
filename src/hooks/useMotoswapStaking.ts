import { useState, useEffect, useCallback, useRef } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { ContractService } from '../services/ContractService';
import { POLL_INTERVAL_MS } from '../config/constants';
import { DEMO_MODE, MOCK_STAKING_DATA } from '../mock';
import { useNetwork } from './useNetwork';
import type { StakingData } from '../types/staking';

export interface MotoswapStakingState {
    readonly data: StakingData | null;
    readonly loading: boolean;
    readonly error: string | null;
    readonly refresh: () => Promise<void>;
}

export function useMotoswapStaking(): MotoswapStakingState {
    const { walletAddress, address } = useWalletConnect();
    const { isConnected } = useNetwork();
    const [data, setData] = useState<StakingData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchData = useCallback(async (): Promise<void> => {
        if (DEMO_MODE) {
            setData({ ...MOCK_STAKING_DATA, fetchedAt: Date.now() });
            return;
        }

        if (!walletAddress || !address) return;

        setLoading(true);
        setError(null);

        try {
            const contract = ContractService.getInstance().getMotoswapStaking(walletAddress);

            const [balanceResult, rewardResult, supplyResult, lastBlockResult] =
                await Promise.all([
                    contract.balanceOf(address),
                    contract.rewardBalance(address),
                    contract.totalSupply(),
                    contract.lastInteractedBlock(address),
                ]);

            const stakedBalance = balanceResult.properties.balance;

            const slashingFeeResult = stakedBalance > 0n
                ? await contract.calculateSlashingFee(address, stakedBalance)
                : null;

            setData({
                stakedBalance,
                pendingRewards: rewardResult.properties.rewardBalance,
                totalStaked: supplyResult.properties.totalSupply,
                lastInteractedBlock: lastBlockResult.properties.lastInteractedBlock,
                slashingFee: slashingFeeResult?.properties.slashingFee ?? 0n,
                fetchedAt: Date.now(),
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch staking data';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [walletAddress, address]);

    useEffect(() => {
        if (!isConnected && !DEMO_MODE) return;

        void fetchData();

        intervalRef.current = setInterval(() => {
            void fetchData();
        }, POLL_INTERVAL_MS);

        return (): void => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchData, isConnected]);

    // Start demo mode polling immediately
    useEffect(() => {
        if (!DEMO_MODE) return;
        void fetchData();
        intervalRef.current = setInterval(() => {
            void fetchData();
        }, POLL_INTERVAL_MS);
        return (): void => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { data, loading, error, refresh: fetchData };
}
