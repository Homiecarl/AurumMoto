import { useEffect } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { ContractService } from '../services/ContractService';
import { ProviderService } from '../services/ProviderService';

export interface NetworkState {
    readonly isConnected: boolean;
    readonly walletAddress: string | null;
}

export function useNetwork(): NetworkState {
    const { walletAddress, network } = useWalletConnect();
    const isConnected = walletAddress !== null && walletAddress !== undefined && walletAddress !== '';

    // Clear contract cache when network changes
    useEffect(() => {
        if (network) {
            ContractService.getInstance().clearCache();
            ProviderService.getInstance().reset();
        }
    }, [network]);

    return { isConnected, walletAddress: walletAddress ?? null };
}
