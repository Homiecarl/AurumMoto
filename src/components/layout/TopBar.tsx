import React from 'react';
import { WalletButton } from '../wallet/WalletButton';
import { NetworkBadge } from '../wallet/NetworkBadge';
import { PricePill } from '../common/PricePill';

interface TopBarProps {
    readonly btcPriceUsd: number | null;
}

export function TopBar({ btcPriceUsd }: TopBarProps): React.JSX.Element {
    return (
        <header className="app-topbar">
            <div>
                <div className="topbar-title">Staking Dashboard</div>
                <div className="topbar-subtitle">Deposit MOTO, earn rewards proportionally</div>
            </div>
            <div className="topbar-right">
                <PricePill priceUsd={btcPriceUsd} />
                <NetworkBadge />
                <WalletButton />
            </div>
        </header>
    );
}
