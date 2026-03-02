import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
    plugins: [
        nodePolyfills({
            include: ['buffer', 'crypto', 'stream', 'util', 'process'],
            globals: { Buffer: true, global: true, process: true },
        }),
        react(),
    ],
    resolve: {
        alias: {
            crypto: 'crypto-browserify',
            stream: 'stream-browserify',
        },
        dedupe: [
            'react',
            'react-dom',
            '@btc-vision/bitcoin',
            '@btc-vision/transaction',
            'opnet',
        ],
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'recharts'],
        esbuildOptions: {
            target: 'esnext',
            define: {
                global: 'globalThis',
            },
        },
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                    recharts: ['recharts'],
                    opnet: ['opnet', '@btc-vision/transaction', '@btc-vision/bitcoin'],
                },
            },
        },
    },
});
