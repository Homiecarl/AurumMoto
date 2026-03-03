export interface StakingData {
    readonly stakedBalance: bigint;
    readonly pendingRewards: bigint;     // total claimable (from rewardBalance)
    readonly totalStaked: bigint;        // total supply in staking contract
    readonly lastInteractedBlock: bigint;
    readonly slashingFee: bigint;        // fee for unstaking full balance now
    readonly fetchedAt: number;
}

export type TxState = 'idle' | 'simulating' | 'approving' | 'pending' | 'success' | 'error';

export interface TxStatus {
    readonly state: TxState;
    readonly txHash?: string;
    readonly message?: string;
}
