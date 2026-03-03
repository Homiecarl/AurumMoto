import { useState, useEffect } from 'react';
import { ContractService } from '../services/ContractService';
import { CONTRACT_ADDRESSES } from '../config/contracts';

export interface PillTokenInfo {
    readonly name: string | null;
    readonly symbol: string | null;
    readonly decimals: number | null;
    readonly totalSupply: bigint | null;
}

export function usePillTokenInfo(): PillTokenInfo {
    const [info, setInfo] = useState<PillTokenInfo>({
        name: null,
        symbol: null,
        decimals: null,
        totalSupply: null,
    });

    useEffect(() => {
        if (!CONTRACT_ADDRESSES.pillToken) return;

        void (async (): Promise<void> => {
            try {
                const contract = ContractService.getInstance().getPillToken();
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
