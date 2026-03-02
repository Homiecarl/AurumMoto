import type { ChartDataPoint } from '../types/chart';

function generateMockHistory(): ChartDataPoint[] {
    const now = Date.now();
    const points: ChartDataPoint[] = [];
    const baseReward = 10_000_000n;

    for (let i = 29; i >= 0; i--) {
        const timestamp = now - i * 24 * 60 * 60 * 1000;
        const dayIndex = BigInt(29 - i + 1);
        points.push({
            timestamp,
            cumulativeRewards: baseReward + dayIndex * 4_500_000n,
            label: new Date(timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }),
        });
    }

    return points;
}

export const MOCK_CHART_DATA: ChartDataPoint[] = generateMockHistory();
