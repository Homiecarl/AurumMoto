import { getContract } from 'opnet';
import { MOTOSWAP_STAKING_ABI, OP_20_ABI } from '../abi/MotoChefAbi';
import type { IMotoswapStakingContract, IOP20Contract } from '../abi/MotoChefAbi';
import { ProviderService } from './ProviderService';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { networks } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';

// Singleton contract cache — never call getContract() inside components
export class ContractService {
    private static instance: ContractService;
    private contracts: Map<string, IMotoswapStakingContract | IOP20Contract> = new Map();

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
                networks.bitcoin,
                sender,
            );

            this.contracts.set(key, contract);
        }

        return this.contracts.get(key) as IMotoswapStakingContract;
    }

    public getMotoToken(senderAddress?: string): IOP20Contract {
        const key = `mototoken:${senderAddress ?? 'anon'}`;

        if (!this.contracts.has(key)) {
            const provider = ProviderService.getInstance().getProvider();
            const contractAddress = CONTRACT_ADDRESSES.motoToken;

            if (!contractAddress) {
                throw new Error('MOTO token contract address not configured');
            }

            let sender: Address | undefined;
            if (senderAddress) {
                try {
                    sender = Address.fromString(senderAddress);
                } catch {
                    sender = undefined;
                }
            }

            const contract = getContract<IOP20Contract>(
                contractAddress,
                OP_20_ABI,
                provider,
                networks.bitcoin,
                sender,
            );

            this.contracts.set(key, contract);
        }

        return this.contracts.get(key) as IOP20Contract;
    }

    public clearCache(): void {
        this.contracts.clear();
    }
}
