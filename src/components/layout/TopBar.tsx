import React from 'react';
import { WalletButton } from '../wallet/WalletButton';
import { NetworkBadge } from '../wallet/NetworkBadge';

export function TopBar(): React.JSX.Element {
    return (
        <header className="app-topbar">
            <div>
                <div className="topbar-title">Staking Dashboard</div>
                <div className="topbar-subtitle">Deposit MOTO, earn rewards proportionally</div>
            </div>
            <div className="topbar-right">
                <NetworkBadge />
                <WalletButton />
            </div>
        </header>
    );
}
