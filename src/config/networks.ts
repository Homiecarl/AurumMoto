import { networks } from '@btc-vision/bitcoin';

export interface NetworkConfig {
    readonly name: string;
    readonly rpcUrl: string;
    readonly explorerUrl: string;
}

export const TESTNET_CONFIG: NetworkConfig = {
    name: 'OPNet Testnet',
    rpcUrl: 'https://testnet.opnet.org',
    explorerUrl: 'https://mempool.space/signet/tx/',
};

export const MAINNET_CONFIG: NetworkConfig = {
    name: 'OPNet Mainnet',
    rpcUrl: 'https://mainnet.opnet.org',
    explorerUrl: 'https://mempool.space/tx/',
};

export const DEFAULT_NETWORK = networks.opnetTestnet;
