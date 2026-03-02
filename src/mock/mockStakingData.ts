import type { StakingData } from '../types/staking';

export const MOCK_STAKING_DATA: StakingData = {
    userInfo: {
        amount: 5_000_00000000n,   // 5,000 MOTO staked (8 decimals)
        rewardDebt: 1_20000000n,
    },
    pendingRewards: 1_42800000n,  // ~1.428 MOTO pending
    poolInfo: {
        allocPoint: 2000n,
        lastRewardBlock: 850_000n,
        accMotoPerShare: 38000_00000000n,
        lpSupply: 125_000_00000000n, // 125,000 MOTO total staked in pool
    },
    totalAllocPoint: 3000n,
    motoPerBlock: 10_00000000n,   // 10 MOTO per block (8 decimals)
    fetchedAt: Date.now(),
};
