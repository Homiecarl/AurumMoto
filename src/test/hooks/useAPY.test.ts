import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAPY } from '../../hooks/useAPY';
import type { StakingData } from '../../types/staking';

const mockData: StakingData = {
    stakedBalance: 5_000_00000000n,
    pendingRewards: 1_42800000n,
    totalStaked: 125_000_00000000n,
    lastInteractedBlock: 850_000n,
    slashingFee: 14_28000n,
    fetchedAt: Date.now(),
};

describe('useAPY', () => {
    it("returns apyDisplay '—' and apy 0 when data is null", () => {
        const { result } = renderHook(() => useAPY(null));
        expect(result.current.apyDisplay).toBe('—');
        expect(result.current.apy).toBe(0);
    });

    it("returns apyDisplay 'Variable' when data is provided", () => {
        const { result } = renderHook(() => useAPY(mockData));
        expect(result.current.apyDisplay).toBe('Variable');
    });
});
