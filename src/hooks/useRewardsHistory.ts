import { useState, useEffect, useRef } from 'react';
import { DEMO_MODE, MOCK_CHART_DATA } from '../mock';
import type { ChartDataPoint } from '../types/chart';
import type { StakingData } from '../types/staking';

const MAX_HISTORY_POINTS = 30;

function buildSyntheticHistory(currentPending: bigint, count: number): ChartDataPoint[] {
    const now = Date.now();
    const points: ChartDataPoint[] = [];

    for (let i = count; i >= 1; i--) {
        const fraction = BigInt(count - i + 1);
        const total = BigInt(count);
        const amount = currentPending > 0n
            ? (currentPending * fraction) / total
            : BigInt(i) * 500_000n;

        const timestamp = now - i * 10 * 60 * 1000; // 10-minute intervals
        points.push({
            timestamp,
            cumulativeRewards: amount,
            label: new Date(timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        });
    }

    return points;
}

export function useRewardsHistory(data: StakingData | null): ChartDataPoint[] {
    const [history, setHistory] = useState<ChartDataPoint[]>(
        DEMO_MODE ? MOCK_CHART_DATA : []
    );
    const hasInitialized = useRef<boolean>(false);
    const prevFetchedAt = useRef<number>(0);

    useEffect(() => {
        if (DEMO_MODE) return;
        if (!data) return;

        // Only update when data is actually refreshed (fetchedAt changes)
        if (data.fetchedAt === prevFetchedAt.current) return;
        prevFetchedAt.current = data.fetchedAt;

        if (!hasInitialized.current) {
            // Seed with synthetic history on first data load
            const synthetic = buildSyntheticHistory(data.pendingRewards, 20);
            setHistory(synthetic);
            hasInitialized.current = true;
            return;
        }

        // Append new snapshot on each poll (rolling window)
        setHistory(prev => [
            ...prev,
            {
                timestamp: Date.now(),
                cumulativeRewards: data.pendingRewards,
                label: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            },
        ].slice(-MAX_HISTORY_POINTS));
    }, [data]);

    return history;
}
