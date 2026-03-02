import React from 'react';
import { NetworkBadge } from '../wallet/NetworkBadge';
import { DEMO_MODE } from '../../mock';

export function Sidebar(): React.JSX.Element {
    return (
        <aside className="app-sidebar" aria-label="Navigation">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo__mark" aria-hidden="true">A</div>
                <div>
                    <div className="sidebar-logo__name">AurumMoto</div>
                    <div className="sidebar-logo__sub">MOTO Staking</div>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav" aria-label="Main navigation">
                <div className="sidebar-nav__item active" aria-current="page">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    Dashboard
                </div>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <NetworkBadge />
                {DEMO_MODE && (
                    <div className="badge badge--purple" style={{ fontSize: 'var(--text-xs)' }}>
                        Demo Mode
                    </div>
                )}
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Powered by OPNet Bitcoin L1
                </div>
            </div>
        </aside>
    );
}
