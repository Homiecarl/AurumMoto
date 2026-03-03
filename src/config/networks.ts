import { networks } from '@btc-vision/bitcoin';

export interface NetworkConfig {
    readonly name: string;
    readonly rpcUrl: string;
    readonly explorerUrl: string;
}

export const MAINNET_CONFIG: NetworkConfig = {
    name: 'OPNet Mainnet',
    rpcUrl: 'https://mainnet.opnet.org',
    explorerUrl: 'https://mempool.space/tx/',
};

// Keep alias so TxStatusModal import doesn't break
export const TESTNET_CONFIG = MAINNET_CONFIG;

export const DEFAULT_NETWORK = networks.bitcoin;
