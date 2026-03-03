export interface ContractAddresses {
    readonly motoswapStaking: string;
    readonly motoToken: string;
    readonly pillToken: string;
}

export const CONTRACT_ADDRESSES: ContractAddresses = {
    motoswapStaking: import.meta.env.VITE_MOTOSWAP_STAKING_ADDRESS ?? '',
    motoToken: import.meta.env.VITE_MOTO_TOKEN_ADDRESS ?? '',
    pillToken: import.meta.env.VITE_PILL_TOKEN_ADDRESS ?? '',
};
