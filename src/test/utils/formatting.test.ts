import { describe, it, expect } from 'vitest';
import { formatMoto, formatAddress, formatTxHash } from '../../utils/formatting';

describe('formatMoto', () => {
    it("formats 0n as '0.00'", () => {
        expect(formatMoto(0n)).toBe('0.00');
    });

    it("formats 1_00000000n as '1.00'", () => {
        expect(formatMoto(1_00000000n)).toBe('1.00');
    });

    it("formats 5_000_00000000n as '5,000.00'", () => {
        expect(formatMoto(5_000_00000000n)).toBe('5,000.00');
    });

    it("formats 1_42800000n and result contains '1.428'", () => {
        expect(formatMoto(1_42800000n)).toContain('1.428');
    });
});

describe('formatAddress', () => {
    it('returns address unchanged when 12 chars or fewer', () => {
        const short = 'bc1qabcdef';
        expect(formatAddress(short)).toBe(short);
    });

    it('truncates long addresses with ellipsis', () => {
        const long = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
        const result = formatAddress(long);
        expect(result).toContain('...');
        expect(result.length).toBeLessThan(long.length);
    });
});

describe('formatTxHash', () => {
    it('truncates hashes longer than 14 chars with ellipsis', () => {
        const hash = 'abcdef1234567890abcdef';
        const result = formatTxHash(hash);
        expect(result).toContain('...');
        expect(result.length).toBeLessThan(hash.length);
    });

    it('returns hash unchanged when 14 chars or fewer', () => {
        const short = 'abcdef123456';
        expect(formatTxHash(short)).toBe(short);
    });
});
