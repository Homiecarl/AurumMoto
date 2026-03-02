import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
    readonly children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps): React.JSX.Element {
    return (
        <div className="app-shell">
            <Sidebar />
            <div className="app-main">
                <TopBar />
                <main className="app-content" id="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
}
