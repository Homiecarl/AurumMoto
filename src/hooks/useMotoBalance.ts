import { useState, useEffect, useCallback } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { ContractService } from '../services/ContractService';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { DEMO_MODE } from '../mock';

export interface MotoBalanceState {
    readonly balance: bigint;
    readonly loading: boolean;
}

const DEMO_BALANCE = 10_000_00000000n; // 10,000 MOTO in demo mode

export function useMotoBalance(): MotoBalanceState {
    const { walletAddress, address } = useWalletConnect();
    const [balance, setBalance] = useState<bigint>(DEMO_MODE ? DEMO_BALANCE : 0n);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBalance = useCallback(async (): Promise<void> => {
        if (DEMO_MODE) {
            setBalance(DEMO_BALANCE);
            return;
        }

        if (!walletAddress || !address || !CONTRACT_ADDRESSES.motoToken) {
            setBalance(0n);
            return;
        }

        setLoading(true);
        try {
            const contract = ContractService.getInstance().getMotoToken(walletAddress);
            const result = await contract.balanceOf(address);
            setBalance(result.properties.balance);
        } catch {
            setBalance(0n);
        } finally {
            setLoading(false);
        }
    }, [walletAddress, address]);

    useEffect(() => {
        void fetchBalance();
    }, [fetchBalance]);

    return { balance, loading };
}
