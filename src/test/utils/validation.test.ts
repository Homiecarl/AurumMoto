import { describe, it, expect } from 'vitest';
import { validateAmount } from '../../utils/validation';

const BALANCE = 10_00000000n; // 10 MOTO at 8 decimals

describe('validateAmount', () => {
    it("returns valid=true and value=1_00000000n for input '1'", () => {
        const result = validateAmount('1', BALANCE);
        expect(result.valid).toBe(true);
        expect(result.error).toBeNull();
        expect(result.value).toBe(1_00000000n);
    });

    it("returns valid=false with truthy error for empty string ''", () => {
        const result = validateAmount('', BALANCE);
        expect(result.valid).toBe(false);
        expect(result.error).toBeTruthy();
    });

    it("returns valid=false for non-numeric input 'abc'", () => {
        const result = validateAmount('abc', BALANCE);
        expect(result.valid).toBe(false);
    });

    it("returns valid=false for negative input '-1'", () => {
        const result = validateAmount('-1', BALANCE);
        expect(result.valid).toBe(false);
    });

    it("returns valid=false with error matching /greater than 0/i for input '0'", () => {
        const result = validateAmount('0', BALANCE);
        expect(result.valid).toBe(false);
        expect(result.error).toMatch(/greater than 0/i);
    });

    it("returns valid=false with error matching /insufficient/i when amount exceeds balance ('100')", () => {
        const result = validateAmount('100', BALANCE);
        expect(result.valid).toBe(false);
        expect(result.error).toMatch(/insufficient/i);
    });

    it("returns valid=true for exact balance '10'", () => {
        const result = validateAmount('10', BALANCE);
        expect(result.valid).toBe(true);
    });

    it("returns valid=true and value=50000000n for '0.5'", () => {
        const result = validateAmount('0.5', BALANCE);
        expect(result.valid).toBe(true);
        expect(result.value).toBe(50000000n);
    });

    it("returns valid=false when amount slightly exceeds balance '10.00000001'", () => {
        const result = validateAmount('10.00000001', BALANCE);
        expect(result.valid).toBe(false);
    });
});
