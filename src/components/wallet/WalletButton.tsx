import React from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { Button } from '../common/Button';
import { formatAddress } from '../../utils/formatting';

export function WalletButton(): React.JSX.Element {
    const { walletAddress, connecting, openConnectModal, disconnect } = useWalletConnect();

    if (connecting) {
        return (
            <Button variant="secondary" size="sm" loading disabled>
                Connecting
            </Button>
        );
    }

    if (walletAddress) {
        return (
            <div className="wallet-connected">
                <span className="wallet-address" aria-label={`Connected wallet: ${walletAddress}`}>
                    {formatAddress(walletAddress)}
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={disconnect}
                    aria-label="Disconnect wallet"
                >
                    Disconnect
                </Button>
            </div>
        );
    }

    return (
        <Button
            variant="primary"
            size="md"
            onClick={openConnectModal}
            aria-label="Connect your OPWallet"
        >
            Connect Wallet
        </Button>
    );
}
