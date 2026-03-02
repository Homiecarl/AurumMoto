import { scaleUp } from './bigint';
import { MOTO_DECIMALS } from '../config/constants';

export interface ValidationResult {
    readonly valid: boolean;
    readonly error: string | null;
    readonly value: bigint;
}

export function validateAmount(input: string, maxBalance: bigint): ValidationResult {
    if (!input || input.trim() === '') {
        return { valid: false, error: 'Amount is required', value: 0n };
    }

    if (!/^\d+(\.\d+)?$/.test(input.trim())) {
        return { valid: false, error: 'Invalid amount format', value: 0n };
    }

    let value: bigint;
    try {
        value = scaleUp(input.trim(), MOTO_DECIMALS);
    } catch {
        return { valid: false, error: 'Invalid amount', value: 0n };
    }

    if (value === 0n) {
        return { valid: false, error: 'Amount must be greater than 0', value: 0n };
    }

    if (value > maxBalance) {
        return { valid: false, error: 'Insufficient balance', value };
    }

    return { valid: true, error: null, value };
}
