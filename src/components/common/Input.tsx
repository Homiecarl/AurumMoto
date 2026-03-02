import React from 'react';

interface InputProps {
    readonly label: string;
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly onMax?: () => void;
    readonly suffix?: string;
    readonly error?: string | null;
    readonly placeholder?: string;
    readonly disabled?: boolean;
}

export function Input({
    label,
    value,
    onChange,
    onMax,
    suffix = 'MOTO',
    error,
    placeholder = '0.00',
    disabled = false,
}: InputProps): React.JSX.Element {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const val = e.target.value;
        // Only allow digits and a single decimal point
        if (/^\d*\.?\d*$/.test(val) || val === '') {
            onChange(val);
        }
    };

    return (
        <div className="input-wrapper">
            <label className="input-label">{label}</label>
            <div className={`input-field-row${error ? ' input-field-row--error' : ''}`}>
                <input
                    type="text"
                    inputMode="decimal"
                    className="input-field"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-label={label}
                    aria-invalid={error !== null && error !== undefined}
                />
                <span className="input-suffix">{suffix}</span>
                {onMax && (
                    <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={onMax}
                        disabled={disabled}
                        aria-label="Set maximum amount"
                    >
                        MAX
                    </button>
                )}
            </div>
            {error && <span className="input-error" role="alert">{error}</span>}
        </div>
    );
}
