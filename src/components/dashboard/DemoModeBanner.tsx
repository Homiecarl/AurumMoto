import React, { useState } from 'react';

export function DemoModeBanner(): React.JSX.Element | null {
    const [dismissed, setDismissed] = useState<boolean>(false);

    if (dismissed) return null;

    return (
        <div className="demo-banner" role="status">
            <span>
                <strong>Demo Mode</strong> — Showing mock data. Set <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>VITE_DEMO_MODE=false</code> and add contract addresses in <code style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>.env</code> to connect to testnet.
            </span>
            <button
                className="btn btn--ghost btn--sm"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss demo mode banner"
            >
                Dismiss
            </button>
        </div>
    );
}
