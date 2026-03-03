import { useState, useEffect } from 'react';

export interface FeeEstimate {
    readonly fastest: number;
    readonly medium: number;
    readonly slow: number;
}

export interface BitcoinStats {
    readonly btcPriceUsd: number | null;
    readonly blockHeight: number | null;
    readonly fees: FeeEstimate | null;
}

const PRICE_POLL_MS = 60_000;
const CHAIN_POLL_MS = 30_000;

async function fetchBtcPrice(): Promise<number | null> {
    try {
        const res = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        );
        if (!res.ok) return null;
        const json = (await res.json()) as { bitcoin: { usd: number } };
        return json.bitcoin.usd;
    } catch {
        return null;
    }
}

async function fetchBlockHeight(): Promise<number | null> {
    try {
        const res = await fetch('https://mempool.space/signet/api/blocks/tip/height');
        if (!res.ok) return null;
        return (await res.json()) as number;
    } catch {
        return null;
    }
}

async function fetchFees(): Promise<FeeEstimate | null> {
    try {
        const res = await fetch('https://mempool.space/api/v1/fees/recommended');
        if (!res.ok) return null;
        const json = (await res.json()) as {
            fastestFee: number;
            halfHourFee: number;
            hourFee: number;
        };
        return { fastest: json.fastestFee, medium: json.halfHourFee, slow: json.hourFee };
    } catch {
        return null;
    }
}

export function useBitcoinStats(): BitcoinStats {
    const [btcPriceUsd, setBtcPriceUsd] = useState<number | null>(null);
    const [blockHeight, setBlockHeight] = useState<number | null>(null);
    const [fees, setFees] = useState<FeeEstimate | null>(null);

    useEffect(() => {
        void fetchBtcPrice().then(setBtcPriceUsd);
        const timer = setInterval(
            (): void => void fetchBtcPrice().then(setBtcPriceUsd),
            PRICE_POLL_MS,
        );
        return (): void => clearInterval(timer);
    }, []);

    useEffect(() => {
        void fetchBlockHeight().then(setBlockHeight);
        void fetchFees().then(setFees);
        const timer = setInterval((): void => {
            void fetchBlockHeight().then(setBlockHeight);
            void fetchFees().then(setFees);
        }, CHAIN_POLL_MS);
        return (): void => clearInterval(timer);
    }, []);

    return { btcPriceUsd, blockHeight, fees };
}
