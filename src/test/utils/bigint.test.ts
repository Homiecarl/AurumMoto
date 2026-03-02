import { describe, it, expect } from 'vitest';
import { scaleDown, scaleUp, safeDivide } from '../../utils/bigint';

describe('scaleDown', () => {
    it('scales down 1_00000000n by 8 decimals to 1', () => {
        expect(scaleDown(1_00000000n, 8)).toBe(1);
    });

    it('scales down 5_00000000n by 8 decimals to 5', () => {
        expect(scaleDown(5_00000000n, 8)).toBe(5);
    });

    it('scales down 1_50000000n by 8 decimals to 1.5', () => {
        expect(scaleDown(1_50000000n, 8)).toBe(1.5);
    });

    it('scales down 0n to 0', () => {
        expect(scaleDown(0n, 8)).toBe(0);
    });

    it('returns Number(value) when decimals is 0', () => {
        expect(scaleDown(42n, 0)).toBe(42);
    });
});

describe('scaleUp', () => {
    it("scales up '1' by 8 decimals to 1_00000000n", () => {
        expect(scaleUp('1', 8)).toBe(1_00000000n);
    });

    it("scales up '5.5' by 8 decimals to 5_50000000n", () => {
        expect(scaleUp('5.5', 8)).toBe(5_50000000n);
    });

    it("scales up '0.001' by 8 decimals to 100000n", () => {
        expect(scaleUp('0.001', 8)).toBe(100000n);
    });

    it("scales up '1.1' by 8 decimals to 1_10000000n", () => {
        expect(scaleUp('1.1', 8)).toBe(1_10000000n);
    });

    it('truncates beyond decimal places: 1.123456789 → 1_12345678n', () => {
        expect(scaleUp('1.123456789', 8)).toBe(1_12345678n);
    });

    it("scales up '0' to 0n", () => {
        expect(scaleUp('0', 8)).toBe(0n);
    });

    it("scales up '100' by 8 decimals to 100_00000000n", () => {
        expect(scaleUp('100', 8)).toBe(100_00000000n);
    });
});

describe('safeDivide', () => {
    it('divides 10n by 2n to get 5n', () => {
        expect(safeDivide(10n, 2n)).toBe(5n);
    });

    it('returns 0n when dividing by 0n (divide-by-zero protection)', () => {
        expect(safeDivide(10n, 0n)).toBe(0n);
    });

    it('returns 0n when numerator is 0n', () => {
        expect(safeDivide(0n, 5n)).toBe(0n);
    });

    it('floors the result for bigint division: 7n / 2n = 3n', () => {
        expect(safeDivide(7n, 2n)).toBe(3n);
    });
});
