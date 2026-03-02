import { useMemo } from 'react';
import { BLOCKS_PER_YEAR } from '../config/constants';
import { safeDivide, scaleDown } from '../utils/bigint';
import type { StakingData } from '../types/staking';

export interface APYResult {
    readonly apy: number;
    readonly apyDisplay: string;
    readonly poolMotoPerBlock: bigint;
}

export function useAPY(data: StakingData | null): APYResult {
    return useMemo((): APYResult => {
        if (!data) return { apy: 0, apyDisplay: '—', poolMotoPerBlock: 0n };

        const { motoPerBlock, poolInfo, totalAllocPoint, userInfo } = data;

        if (totalAllocPoint === 0n || poolInfo.allocPoint === 0n) {
            return { apy: 0, apyDisplay: '0.00%', poolMotoPerBlock: 0n };
        }

        // Pool's share of total emissions
        const poolMotoPerBlock = safeDivide(motoPerBlock * poolInfo.allocPoint, totalAllocPoint);
        const poolMotoPerYear = poolMotoPerBlock * BLOCKS_PER_YEAR;

        // Total staked in pool — use lpSupply if available, otherwise user's staked amount
        const totalStaked = poolInfo.lpSupply ?? userInfo.amount;

        if (totalStaked === 0n) {
            return { apy: 0, apyDisplay: '0.00%', poolMotoPerBlock };
        }

        // Scale to avoid bigint precision loss: multiply by 100_000 for 3 decimal places (%)
        const apyScaled = safeDivide(poolMotoPerYear * 100_000n, totalStaked);
        const apyPercent = scaleDown(apyScaled, 3); // 3 decimal places from *100_000

        return {
            apy: apyPercent,
            apyDisplay: apyPercent > 9_999_999
                ? '>9,999,999%'
                : `${apyPercent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
            poolMotoPerBlock,
        };
    }, [data]);
}
