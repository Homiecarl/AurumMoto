import { JSONRpcProvider } from 'opnet';
import { MAINNET_CONFIG } from '../config/networks';
import { RPC_TIMEOUT_MS } from '../config/constants';
import { networks } from '@btc-vision/bitcoin';

// Singleton provider — never instantiate JSONRpcProvider inside components
export class ProviderService {
    private static instance: ProviderService;
    private provider: JSONRpcProvider | null = null;

    private constructor() {}

    public static getInstance(): ProviderService {
        if (!ProviderService.instance) {
            ProviderService.instance = new ProviderService();
        }
        return ProviderService.instance;
    }

    public getProvider(): JSONRpcProvider {
        if (!this.provider) {
            this.provider = new JSONRpcProvider({
                url: MAINNET_CONFIG.rpcUrl,
                network: networks.bitcoin,
                timeout: RPC_TIMEOUT_MS,
            });
        }
        return this.provider;
    }

    public reset(): void {
        this.provider = null;
    }
}
