/** Scale a bigint down by decimals for display */
export function scaleDown(value: bigint, decimals: number): number {
    if (decimals <= 0) return Number(value);
    const divisor = 10n ** BigInt(decimals);
    const whole = value / divisor;
    const remainder = value % divisor;
    return Number(whole) + Number(remainder) / Math.pow(10, decimals);
}

/** Scale a display string up to bigint with decimals */
export function scaleUp(value: string, decimals: number): bigint {
    const sanitized = value.replace(/[^\d.]/g, '');
    const [wholePart, fractionPart = ''] = sanitized.split('.');
    const paddedFraction = fractionPart.padEnd(decimals, '0').slice(0, decimals);
    const whole = wholePart === '' ? 0n : BigInt(wholePart);
    const fraction = paddedFraction === '' ? 0n : BigInt(paddedFraction);
    return whole * (10n ** BigInt(decimals)) + fraction;
}

/** Safe bigint division returning 0n on divide-by-zero */
export function safeDivide(a: bigint, b: bigint): bigint {
    if (b === 0n) return 0n;
    return a / b;
}
