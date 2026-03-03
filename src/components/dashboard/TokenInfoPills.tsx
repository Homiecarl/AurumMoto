import React from 'react';
import { formatMoto } from '../../utils/formatting';
import type { MotoTokenInfo } from '../../hooks/useMotoTokenInfo';
import type { PillTokenInfo } from '../../hooks/usePillTokenInfo';

interface TokenInfoPillsProps {
    readonly motoInfo: MotoTokenInfo;
    readonly pillInfo: PillTokenInfo;
}

export function TokenInfoPills({ motoInfo, pillInfo }: TokenInfoPillsProps): React.JSX.Element | null {
    const hasMoto = Boolean(motoInfo.symbol);
    const hasPill = Boolean(pillInfo.symbol);

    if (!hasMoto && !hasPill) return null;

    return (
        <div className="token-pills-row">
            {hasMoto && (
                <div className="token-pills">
                    <span className="token-pill token-pill--gold">{motoInfo.symbol}</span>
                    {motoInfo.name && (
                        <span className="token-pill">{motoInfo.name}</span>
                    )}
                    {motoInfo.totalSupply !== null && (
                        <span className="token-pill">
                            Supply&nbsp;{formatMoto(motoInfo.totalSupply)}
                        </span>
                    )}
                    {motoInfo.decimals !== null && (
                        <span className="token-pill">{motoInfo.decimals}&nbsp;decimals</span>
                    )}
                </div>
            )}

            {hasMoto && hasPill && <div className="token-pills-divider" />}

            {hasPill && (
                <div className="token-pills">
                    <span className="token-pill token-pill--green">{pillInfo.symbol}</span>
                    {pillInfo.name && (
                        <span className="token-pill">{pillInfo.name}</span>
                    )}
                    {pillInfo.totalSupply !== null && (
                        <span className="token-pill">
                            Supply&nbsp;{formatMoto(pillInfo.totalSupply)}
                        </span>
                    )}
                    {pillInfo.decimals !== null && (
                        <span className="token-pill">{pillInfo.decimals}&nbsp;decimals</span>
                    )}
                </div>
            )}

            <span className="token-pill token-pill--purple">Bitcoin L1</span>
        </div>
    );
}
