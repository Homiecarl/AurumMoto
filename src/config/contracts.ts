export interface ContractAddresses {
    readonly motoChef: string;
    readonly motoToken: string;
}

export const CONTRACT_ADDRESSES: ContractAddresses = {
    motoChef: import.meta.env.VITE_MOTOCHEF_ADDRESS ?? '',
    motoToken: import.meta.env.VITE_MOTO_TOKEN_ADDRESS ?? '',
};
