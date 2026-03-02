import { useState, useEffect, useCallback, useRef } from 'react';
import { Address } from '@btc-vision/transaction';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { ContractService } from '../services/ContractService';
import { POOL_ID, POLL_INTERVAL_MS } from '../config/constants';
import { DEMO_MODE, MOCK_STAKING_DATA } from '../mock';
import { useNetwork } from './useNetwork';
import type { StakingData } from '../types/staking';

export interface MotoChefState {
    readonly data: StakingData | null;
    readonly loading: boolean;
    readonly error: string | null;
    readonly refresh: () => Promise<void>;
}

export function useMotoChef(): MotoChefState {
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
            const contract = ContractService.getInstance().getMotoChef(walletAddress);
            const userAddr: Address = address;

            const [userInfoResult, pendingResult, poolInfoResult, totalAllocResult, motoPerBlockResult] =
                await Promise.all([
                    contract.getUserInfo(POOL_ID, userAddr),
                    contract.pendingMoto(POOL_ID, userAddr),
                    contract.getPoolInfo(POOL_ID),
                    contract.totalAllocPoint(),
                    contract.getMotoPerBlock(),
                ]);

            setData({
                userInfo: {
                    amount: userInfoResult.properties.amount,
                    rewardDebt: userInfoResult.properties.rewardDebt,
                },
                pendingRewards: pendingResult.properties.pendingMoto,
                poolInfo: {
                    allocPoint: poolInfoResult.properties.allocPoint,
                    lastRewardBlock: poolInfoResult.properties.lastRewardBlock,
                    accMotoPerShare: poolInfoResult.properties.accMotoPerShare,
                },
                totalAllocPoint: totalAllocResult.properties.totalAllocPoint,
                motoPerBlock: motoPerBlockResult.properties.motoPerBlock,
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
