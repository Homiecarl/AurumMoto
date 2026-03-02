import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import { Skeleton } from '../common/Skeleton';
import { scaleDown } from '../../utils/bigint';
import { MOTO_DECIMALS } from '../../config/constants';
import type { ChartDataPoint, ChartDisplayPoint } from '../../types/chart';
import type { TooltipProps } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

interface RewardsChartProps {
    readonly data: ChartDataPoint[];
    readonly loading: boolean;
}

function CustomTooltip({ active, payload, label }: TooltipProps<ValueType, NameType>): React.JSX.Element | null {
    if (!active || !payload || payload.length === 0) return null;
    const value = payload[0]?.value;
    return (
        <div style={{
            background: 'var(--surface-overlay)',
            border: '1px solid var(--border-interactive)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            boxShadow: 'var(--shadow-md)',
        }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 4 }}>{label}</div>
            <div style={{ color: 'var(--accent-gold)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
                {typeof value === 'number' ? value.toFixed(6) : '—'} MOTO
            </div>
        </div>
    );
}

export function RewardsChart({ data, loading }: RewardsChartProps): React.JSX.Element {
    if (loading && data.length === 0) {
        return (
            <div className="chart-container">
                <div className="chart-title">Rewards Earned Over Time</div>
                <Skeleton variant="chart" />
            </div>
        );
    }

    const chartData: ChartDisplayPoint[] = data.map(point => ({
        label: point.label,
        rewards: scaleDown(point.cumulativeRewards, MOTO_DECIMALS),
    }));

    return (
        <div className="chart-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <h3 className="chart-title" style={{ marginBottom: 0 }}>Rewards Earned Over Time</h3>
                <div className="badge badge--gold">MOTO</div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="rewardGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#d4aa50" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#d4aa50" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.05)"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                        tickLine={false}
                        axisLine={false}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-display)' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: number) => v.toFixed(3)}
                        width={60}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="rewards"
                        stroke="#d4aa50"
                        strokeWidth={2.5}
                        fill="url(#rewardGradient)"
                        dot={false}
                        activeDot={{ r: 5, fill: '#d4aa50', stroke: 'var(--surface-base)', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
