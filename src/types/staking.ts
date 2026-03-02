export interface UserInfo {
    readonly amount: bigint;
    readonly rewardDebt: bigint;
}

export interface PoolInfo {
    readonly allocPoint: bigint;
    readonly lastRewardBlock: bigint;
    readonly accMotoPerShare: bigint;
    readonly lpSupply?: bigint;
}

export interface StakingData {
    readonly userInfo: UserInfo;
    readonly pendingRewards: bigint;
    readonly poolInfo: PoolInfo;
    readonly totalAllocPoint: bigint;
    readonly motoPerBlock: bigint;
    readonly fetchedAt: number;
}

export type TxState = 'idle' | 'simulating' | 'pending' | 'success' | 'error';

export interface TxStatus {
    readonly state: TxState;
    readonly txHash?: string;
    readonly message?: string;
}
