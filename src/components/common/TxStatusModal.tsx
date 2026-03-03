import React from 'react';
import { Button } from './Button';
import { formatTxHash } from '../../utils/formatting';
import { TESTNET_CONFIG } from '../../config/networks';
import type { TxStatus } from '../../types/staking';

interface TxStatusModalProps {
    readonly status: TxStatus;
    readonly onClose: () => void;
}

const STATUS_CONFIG = {
    idle: null,
    simulating: {
        icon: '◌',
        title: 'Simulating Transaction',
        desc: 'Preparing your transaction...',
        color: 'var(--color-info)',
    },
    approving: {
        icon: '◌',
        title: 'Approving Token',
        desc: 'Step 1 of 2: Approve MOTO spending in your wallet...',
        color: 'var(--color-info)',
    },
    pending: {
        icon: '⟳',
        title: 'Transaction Pending',
        desc: 'Waiting for confirmation on Bitcoin...',
        color: 'var(--accent-gold)',
    },
    success: {
        icon: '✓',
        title: 'Transaction Confirmed',
        desc: 'Your transaction was successful.',
        color: 'var(--color-success)',
    },
    error: {
        icon: '✕',
        title: 'Transaction Failed',
        desc: '',
        color: 'var(--color-error)',
    },
} as const;

export function TxStatusModal({ status, onClose }: TxStatusModalProps): React.JSX.Element | null {
    if (status.state === 'idle') return null;

    const config = STATUS_CONFIG[status.state];
    if (!config) return null;

    const isLoading = status.state === 'simulating' || status.state === 'approving' || status.state === 'pending';
    const desc = status.state === 'error' ? (status.message ?? 'An unknown error occurred.') : config.desc;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="tx-modal-title">
            <div className="modal-box">
                <div
                    style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: `rgba(${config.color === 'var(--color-success)' ? '61,220,132' : config.color === 'var(--color-error)' ? '224,82,96' : '212,170,80'}, 0.12)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        color: config.color,
                        animation: isLoading ? 'spin 1s linear infinite' : 'scale-in 0.2s both',
                    }}
                    aria-hidden="true"
                >
                    {config.icon}
                </div>

                <h3 id="tx-modal-title" style={{ color: 'var(--text-primary)' }}>{config.title}</h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{desc}</p>

                {status.state === 'success' && status.txHash && (
                    <a
                        href={`${TESTNET_CONFIG.explorerUrl}${status.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tx-hash-link"
                    >
                        {formatTxHash(status.txHash)} ↗
                    </a>
                )}

                {!isLoading && (
                    <Button variant="secondary" size="md" onClick={onClose}>
                        Close
                    </Button>
                )}
            </div>
        </div>
    );
}
