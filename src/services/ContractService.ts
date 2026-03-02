import { getContract } from 'opnet';
import { MOTOSWAP_STAKING_ABI } from '../abi/MotoChefAbi';
import type { IMotoswapStakingContract } from '../abi/MotoChefAbi';
import { ProviderService } from './ProviderService';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { networks } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';

// Singleton contract cache — never call getContract() inside components
export class ContractService {
    private static instance: ContractService;
    private contracts: Map<string, IMotoswapStakingContract> = new Map();

    private constructor() {}

    public static getInstance(): ContractService {
        if (!ContractService.instance) {
            ContractService.instance = new ContractService();
        }
        return ContractService.instance;
    }

    public getMotoswapStaking(senderAddress?: string): IMotoswapStakingContract {
        const key = `staking:${senderAddress ?? 'anon'}`;

        if (!this.contracts.has(key)) {
            const provider = ProviderService.getInstance().getProvider();
            const contractAddress = CONTRACT_ADDRESSES.motoswapStaking;

            if (!contractAddress) {
                throw new Error('Motoswap staking contract address not configured');
            }

            let sender: Address | undefined;
            if (senderAddress) {
                try {
                    sender = Address.fromString(senderAddress);
                } catch {
                    sender = undefined;
                }
            }

            const contract = getContract<IMotoswapStakingContract>(
                contractAddress,
                MOTOSWAP_STAKING_ABI,
                provider,
                networks.opnetTestnet,
                sender,
            );

            this.contracts.set(key, contract);
        }

        return this.contracts.get(key) as IMotoswapStakingContract;
    }

    public clearCache(): void {
        this.contracts.clear();
    }
}
