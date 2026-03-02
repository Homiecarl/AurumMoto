import { MOTO_DECIMALS } from '../config/constants';
import { scaleDown } from './bigint';

export function formatAddress(address: string): string {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatMoto(amount: bigint): string {
    const value = scaleDown(amount, MOTO_DECIMALS);
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
    }).format(value);
}

export function formatAPY(apy: number): string {
    if (!isFinite(apy) || apy < 0) return '—';
    if (apy > 9_999_999) return '>9,999,999%';
    return `${apy.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

export function formatTxHash(hash: string): string {
    if (hash.length <= 14) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export function formatBlockNumber(block: bigint): string {
    return block.toLocaleString('en-US');
}

export function formatTimestamp(ts: number): string {
    return new Date(ts).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
