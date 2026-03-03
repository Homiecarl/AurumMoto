import { useState, useEffect } from 'react';
import { ContractService } from '../services/ContractService';
import { CONTRACT_ADDRESSES } from '../config/contracts';

export interface MotoTokenInfo {
    readonly name: string | null;
    readonly symbol: string | null;
    readonly decimals: number | null;
    readonly totalSupply: bigint | null;
}

export function useMotoTokenInfo(): MotoTokenInfo {
    const [info, setInfo] = useState<MotoTokenInfo>({
        name: null,
        symbol: null,
        decimals: null,
        totalSupply: null,
    });

    useEffect(() => {
        if (!CONTRACT_ADDRESSES.motoToken) return;

        void (async (): Promise<void> => {
            try {
                const contract = ContractService.getInstance().getMotoToken();
                const result = await contract.metadata();
                setInfo({
                    name: result.properties.name,
                    symbol: result.properties.symbol,
                    decimals: result.properties.decimals,
                    totalSupply: result.properties.totalSupply,
                });
            } catch {
                // Token info is non-critical — silently ignore failures
            }
        })();
    }, []);

    return info;
}
