import { useState, useCallback } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { Address } from '@btc-vision/transaction';
import { networks } from '@btc-vision/bitcoin';
import { ContractService } from '../services/ContractService';
import { POOL_ID, MAX_ALLOWED_SAT } from '../config/constants';
import type { TxStatus } from '../types/staking';

export interface StakeActionsState {
    readonly txStatus: TxStatus;
    readonly stake: (amount: bigint) => Promise<void>;
    readonly unstake: (amount: bigint) => Promise<void>;
    readonly harvest: () => Promise<void>;
    readonly resetTxStatus: () => void;
}

export function useStakeActions(): StakeActionsState {
    const { walletAddress, address } = useWalletConnect();
    const [txStatus, setTxStatus] = useState<TxStatus>({ state: 'idle' });

    const stake = useCallback(async (amount: bigint): Promise<void> => {
        if (!walletAddress || !address) {
            setTxStatus({ state: 'error', message: 'Wallet not connected' });
            return;
        }

        setTxStatus({ state: 'simulating' });

        try {
            const contract = ContractService.getInstance().getMotoChef(walletAddress);
            const userAddr: Address = address;

            // Simulate first
            const simulation = await contract.deposit(POOL_ID, amount, userAddr);

            setTxStatus({ state: 'pending' });

            // Send — signer: null, mldsaSigner: null (wallet handles signing on frontend)
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
    }, [walletAddress, address]);

    const unstake = useCallback(async (amount: bigint): Promise<void> => {
        if (!walletAddress || !address) {
            setTxStatus({ state: 'error', message: 'Wallet not connected' });
            return;
        }

        setTxStatus({ state: 'simulating' });

        try {
            const contract = ContractService.getInstance().getMotoChef(walletAddress);
            const userAddr: Address = address;

            const simulation = await contract.withdraw(POOL_ID, amount, userAddr);

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
    }, [walletAddress, address]);

    const harvest = useCallback(async (): Promise<void> => {
        if (!walletAddress || !address) {
            setTxStatus({ state: 'error', message: 'Wallet not connected' });
            return;
        }

        setTxStatus({ state: 'simulating' });

        try {
            const contract = ContractService.getInstance().getMotoChef(walletAddress);
            const userAddr: Address = address;

            const simulation = await contract.harvest(POOL_ID, userAddr);

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
    }, [walletAddress, address]);

    const resetTxStatus = useCallback((): void => {
        setTxStatus({ state: 'idle' });
    }, []);

    return { txStatus, stake, unstake, harvest, resetTxStatus };
}
