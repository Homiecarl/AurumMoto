// MotoChef pool methods use number (not bigint) for poolId
export const POOL_ID: number = Number(import.meta.env.VITE_POOL_ID ?? '0');
export const MOTO_DECIMALS: number = 8;
export const BLOCKS_PER_YEAR: bigint = 52_560n;
export const POLL_INTERVAL_MS: number = 10_000;
export const MAX_ALLOWED_SAT: bigint = 10_000n;
export const RPC_TIMEOUT_MS: number = 30_000;
