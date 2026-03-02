import React from 'react';
import { formatMoto, formatTimestamp } from '../../utils/formatting';
import { Skeleton } from '../common/Skeleton';
import type { ChartDataPoint } from '../../types/chart';

interface RewardsHistoryTableProps {
    readonly data: ChartDataPoint[];
    readonly loading: boolean;
}

export function RewardsHistoryTable({ data, loading }: RewardsHistoryTableProps): React.JSX.Element {
    const reversed = [...data].reverse();

    return (
        <div className="card">
            <div className="section-header" style={{ marginBottom: 'var(--space-4)' }}>
                <h3 className="section-title">Rewards History</h3>
                <div className="badge badge--purple">{data.length} snapshots</div>
            </div>

            {loading && data.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} variant="full" />
                    ))}
                </div>
            ) : data.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-8) 0' }}>
                    Rewards history will appear here as the dashboard polls for updates.
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table" aria-label="Rewards history table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Time</th>
                                <th scope="col">Cumulative Rewards</th>
                                <th scope="col">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reversed.map((point, index) => {
                                const prev = reversed[index + 1];
                                const delta = prev
                                    ? point.cumulativeRewards - prev.cumulativeRewards
                                    : point.cumulativeRewards;

                                return (
                                    <tr key={point.timestamp}>
                                        <td className="td-mono" style={{ color: 'var(--text-muted)' }}>
                                            {data.length - index}
                                        </td>
                                        <td>{formatTimestamp(point.timestamp)}</td>
                                        <td className="td-gold">{formatMoto(point.cumulativeRewards)} MOTO</td>
                                        <td>
                                            {delta > 0n ? (
                                                <span style={{ color: 'var(--color-success)', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                                                    +{formatMoto(delta)}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'var(--text-muted)' }}>—</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
