import React from 'react';

export function NetworkBadge(): React.JSX.Element {
    return (
        <div className="network-badge" aria-label="Connected network: OPNet Testnet">
            <span className="live-dot" aria-hidden="true" />
            OPNet Testnet
        </div>
    );
}
