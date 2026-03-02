import type { StakingData } from '../types/staking';

export const MOCK_STAKING_DATA: StakingData = {
    stakedBalance: 5_000_00000000n,    // 5,000 MOTO staked (8 decimals)
    pendingRewards: 1_42800000n,        // ~1.428 MOTO claimable
    totalStaked: 125_000_00000000n,    // 125,000 MOTO total staked
    lastInteractedBlock: 850_000n,
    slashingFee: 14_28000n,            // ~0.1428 MOTO slashing fee (~10%)
    fetchedAt: Date.now(),
};
