import React from 'react';
import { formatMoto } from '../../utils/formatting';
import type { MotoTokenInfo } from '../../hooks/useMotoTokenInfo';

interface TokenInfoPillsProps {
    readonly info: MotoTokenInfo;
}

export function TokenInfoPills({ info }: TokenInfoPillsProps): React.JSX.Element | null {
    if (!info.symbol && info.totalSupply === null) return null;

    return (
        <div className="token-pills">
            {info.symbol && (
                <span className="token-pill token-pill--gold">{info.symbol}</span>
            )}
            {info.name && (
                <span className="token-pill">{info.name}</span>
            )}
            {info.totalSupply !== null && (
                <span className="token-pill">
                    Supply&nbsp;{formatMoto(info.totalSupply)}
                </span>
            )}
            {info.decimals !== null && (
                <span className="token-pill">
                    {info.decimals}&nbsp;decimals
                </span>
            )}
            <span className="token-pill token-pill--purple">Bitcoin L1</span>
        </div>
    );
}
