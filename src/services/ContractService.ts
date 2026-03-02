import { getContract } from 'opnet';
import { MOTOCHEF_ABI } from '../abi/MotoChefAbi';
import type { IMotoChef } from '../abi/MotoChefAbi';
import { ProviderService } from './ProviderService';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { networks } from '@btc-vision/bitcoin';
import { Address } from '@btc-vision/transaction';

// Singleton contract cache — never call getContract() inside components
export class ContractService {
    private static instance: ContractService;
    private contracts: Map<string, IMotoChef> = new Map();

    private constructor() {}

    public static getInstance(): ContractService {
        if (!ContractService.instance) {
            ContractService.instance = new ContractService();
        }
        return ContractService.instance;
    }

    public getMotoChef(senderAddress?: string): IMotoChef {
        const key = `motochef:${senderAddress ?? 'anon'}`;

        if (!this.contracts.has(key)) {
            const provider = ProviderService.getInstance().getProvider();
            const contractAddress = CONTRACT_ADDRESSES.motoChef;

            if (!contractAddress) {
                throw new Error('MotoChef contract address not configured');
            }

            let sender: Address | undefined;
            if (senderAddress) {
                try {
                    sender = Address.fromString(senderAddress);
                } catch {
                    sender = undefined;
                }
            }

            const contract = getContract<IMotoChef>(
                contractAddress,
                MOTOCHEF_ABI,
                provider,
                networks.opnetTestnet,
                sender,
            );

            this.contracts.set(key, contract);
        }

        return this.contracts.get(key) as IMotoChef;
    }

    public clearCache(): void {
        this.contracts.clear();
    }
}
