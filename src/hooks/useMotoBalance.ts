import { useState, useEffect, useCallback } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { DEMO_MODE } from '../mock';

export interface MotoBalanceState {
    readonly balance: bigint;
    readonly loading: boolean;
}

const DEMO_BALANCE = 10_000_00000000n; // 10,000 MOTO in demo mode

export function useMotoBalance(): MotoBalanceState {
    const { walletBalance } = useWalletConnect();
    const [balance, setBalance] = useState<bigint>(DEMO_MODE ? DEMO_BALANCE : 0n);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBalance = useCallback(async (): Promise<void> => {
        if (DEMO_MODE) {
            setBalance(DEMO_BALANCE);
            return;
        }
        // In live mode, use the wallet's BTC balance as a proxy
        // The actual MOTO balance requires calling the MOTO OP20 token contract
        // For now, provide a fallback — this can be expanded when MOTO token address is set
        setLoading(true);
        try {
            if (walletBalance) {
                // Placeholder: convert sats to bigint (this is BTC balance, not MOTO)
                // TODO: Replace with actual MOTO OP20 balanceOf call when token address is configured
                setBalance(BigInt(Math.floor(walletBalance.total)));
            }
        } finally {
            setLoading(false);
        }
    }, [walletBalance]);

    useEffect(() => {
        void fetchBalance();
    }, [fetchBalance]);

    return { balance, loading };
}
