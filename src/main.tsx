import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WalletConnectProvider } from '@btc-vision/walletconnect';
import App from './App';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element #root not found in document');
}

createRoot(rootElement).render(
    <StrictMode>
        <WalletConnectProvider>
            <App />
        </WalletConnectProvider>
    </StrictMode>,
);
