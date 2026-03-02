import { DEMO_MODE, MOCK_STAKING_DATA, MOCK_CHART_DATA } from '../mock';
import type { StakingData } from '../types/staking';
import type { ChartDataPoint } from '../types/chart';

export interface DemoModeState {
    readonly isDemoMode: boolean;
    readonly demoStakingData: StakingData;
    readonly demoChartData: ChartDataPoint[];
}

export function useDemoMode(): DemoModeState {
    return {
        isDemoMode: DEMO_MODE,
        demoStakingData: MOCK_STAKING_DATA,
        demoChartData: MOCK_CHART_DATA,
    };
}
