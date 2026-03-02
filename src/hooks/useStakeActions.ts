import { useState, useCallback } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { networks } from '@btc-vision/bitcoin';
import { ContractService } from '../services/ContractService';
import { MAX_ALLOWED_SAT } from '../config/constants';
import type { TxStatus } from '../types/staking';

export interface StakeActionsState {
    readonly txStatus: TxStatus;
    readonly stake: (amount: bigint) => Promise<void>;
    readonly unstake: () => Promise<void>;
    readonly claimRewards: () => Promise<void>;
    readonly resetTxStatus: () => void;
}

export function useStakeActions(): StakeActionsState {
    const { walletAddress } = useWalletConnect();
    const [txStatus, setTxStatus] = useState<TxStatus>({ state: 'idle' });

    const stake = useCallback(async (amount: bigint): Promise<void> => {
        if (!walletAddress) {
            setTxStatus({ state: 'error', message: 'Wallet not connected' });
            return;
        }

        setTxStatus({ state: 'simulating' });

        try {
            const contract = ContractService.getInstance().getMotoswapStaking(walletAddress);

            const simulation = await contract.stake(amount);

            setTxStatus({ state: 'pending' });

            const receipt = await simulation.sendTransaction({
                signer: null,
                mldsaSigner: null,
                refundTo: walletAddress,
                maximumAllowedSatToSpend: MAX_ALLOWED_SAT,
                network: networks.opnetTestnet,
            });

            setTxStatus({
                state: 'success',
                txHash: receipt?.transactionId ?? '',
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Transaction failed';
            setTxStatus({ state: 'error', message });
        }
    }, [walletAddress]);

    const unstake = useCallback(async (): Promise<void> => {
        if (!walletAddress) {
            setTxStatus({ state: 'error', message: 'Wallet not connected' });
            return;
        }

        setTxStatus({ state: 'simulating' });

        try {
            const contract = ContractService.getInstance().getMotoswapStaking(walletAddress);

            const simulation = await contract.unstake();

            setTxStatus({ state: 'pending' });

            const receipt = await simulation.sendTransaction({
                signer: null,
                mldsaSigner: null,
                refundTo: walletAddress,
                maximumAllowedSatToSpend: MAX_ALLOWED_SAT,
                network: networks.opnetTestnet,
            });

            setTxStatus({
                state: 'success',
                txHash: receipt?.transactionId ?? '',
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Transaction failed';
            setTxStatus({ state: 'error', message });
        }
    }, [walletAddress]);

    const claimRewards = useCallback(async (): Promise<void> => {
        if (!walletAddress) {
            setTxStatus({ state: 'error', message: 'Wallet not connected' });
            return;
        }

        setTxStatus({ state: 'simulating' });

        try {
            const contract = ContractService.getInstance().getMotoswapStaking(walletAddress);

            const simulation = await contract.claimRewards();

            setTxStatus({ state: 'pending' });

            const receipt = await simulation.sendTransaction({
                signer: null,
                mldsaSigner: null,
                refundTo: walletAddress,
                maximumAllowedSatToSpend: MAX_ALLOWED_SAT,
                network: networks.opnetTestnet,
            });

            setTxStatus({
                state: 'success',
                txHash: receipt?.transactionId ?? '',
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Transaction failed';
            setTxStatus({ state: 'error', message });
        }
    }, [walletAddress]);

    const resetTxStatus = useCallback((): void => {
        setTxStatus({ state: 'idle' });
    }, []);

    return { txStatus, stake, unstake, claimRewards, resetTxStatus };
}
