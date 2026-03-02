import { networks } from '@btc-vision/bitcoin';

export interface NetworkConfig {
    readonly name: string;
    readonly rpcUrl: string;
    readonly explorerUrl: string;
}

// CRITICAL: Use networks.opnetTestnet — NEVER networks.testnet (that is Testnet4)
export const TESTNET_CONFIG: NetworkConfig = {
    name: 'OPNet Testnet',
    rpcUrl: 'https://testnet.opnet.org',
    explorerUrl: 'https://testnet.opnet.org/tx/',
};

export const DEFAULT_NETWORK = networks.opnetTestnet;
