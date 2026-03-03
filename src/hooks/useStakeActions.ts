import { useState, useCallback } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { networks } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';
import { ContractService } from '../services/ContractService';
import { CONTRACT_ADDRESSES } from '../config/contracts';
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
    const { walletAddress, address } = useWalletConnect();
    const [txStatus, setTxStatus] = useState<TxStatus>({ state: 'idle' });

    const stake = useCallback(async (amount: bigint): Promise<void> => {
        if (!walletAddress || !address) {
            setTxStatus({ state: 'error', message: 'Wallet not connected' });
            return;
        }

        const stakingAddress = CONTRACT_ADDRESSES.motoswapStaking;
        if (!stakingAddress || !CONTRACT_ADDRESSES.motoToken) {
            setTxStatus({ state: 'error', message: 'Contract addresses not configured' });
            return;
        }

        setTxStatus({ state: 'simulating' });

        try {
            const tokenContract = ContractService.getInstance().getMotoToken(walletAddress);
            const stakingContract = ContractService.getInstance().getMotoswapStaking(walletAddress);

            // OP20 requires approval before the staking contract can transferFrom
            const spender = Address.fromString(stakingAddress);
            const allowanceResult = await tokenContract.allowance(address, spender);
            const remaining = allowanceResult.properties.remaining;

            if (remaining < amount) {
                setTxStatus({ state: 'approving' });
                const approvalSim = await tokenContract.increaseAllowance(spender, amount);
                await approvalSim.sendTransaction({
                    signer: null,
                    mldsaSigner: null,
                    refundTo: walletAddress,
                    maximumAllowedSatToSpend: MAX_ALLOWED_SAT,
                    network: networks.opnetTestnet,
                });
            }

            setTxStatus({ state: 'simulating' });
            const stakeSim = await stakingContract.stake(amount);
            setTxStatus({ state: 'pending' });

            const receipt = await stakeSim.sendTransaction({
                signer: null,
                mldsaSigner: null,
                refundTo: walletAddress,
                maximumAllowedSatToSpend: MAX_ALLOWED_SAT,
                network: networks.opnetTestnet,
            });

            setTxStatus({ state: 'success', txHash: receipt?.transactionId ?? '' });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Transaction failed';
            setTxStatus({ state: 'error', message });
        }
    }, [walletAddress, address]);

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
