import React from 'react';

interface ErrorMessageProps {
    readonly message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps): React.JSX.Element | null {
    if (!message) return null;
    return (
        <div className="badge badge--error" role="alert" style={{ fontSize: 'var(--text-sm)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)' }}>
            {message}
        </div>
    );
}
