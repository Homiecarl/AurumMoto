export interface ChartDataPoint {
    readonly timestamp: number;
    readonly cumulativeRewards: bigint;
    readonly label: string;
}

export interface ChartDisplayPoint {
    readonly label: string;
    readonly rewards: number;
}
