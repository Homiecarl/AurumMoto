import { useMemo } from 'react';
import type { StakingData } from '../types/staking';

export interface APYResult {
    readonly apy: number;
    readonly apyDisplay: string;
}

// Motoswap staking uses Proof-of-Hodl variable emissions.
// APY increases the longer tokens are held without interacting.
// Without on-chain emission rate data, we display "Variable".
export function useAPY(data: StakingData | null): APYResult {
    return useMemo((): APYResult => {
        if (!data) return { apy: 0, apyDisplay: '—' };
        return { apy: 0, apyDisplay: 'Variable' };
    }, [data]);
}
