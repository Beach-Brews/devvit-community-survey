/*!
 * A helper component for consistent text fields.
 * AI Assisted.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { KeyboardEvent, useState } from 'react';
import { DescriptionTooltip } from './DescriptionTooltip';
import { useDebounce } from '../../../../shared/debounce';

export type NumberFieldProps = {
    label: string;
    description?: string;
    value: number | undefined;
    min?: number;
    max?: number;
    required?: boolean;
    disabled?: boolean;
    allowDecimal?: boolean;
    onChange: (value: number | undefined) => void;
    onValidate?: (value: string) => (string|undefined);
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
};

export const NumberField = ({
    label,
    description,
    value: initialValue,
    min,
    max,
    required = false,
    disabled = false,
    allowDecimal = false,
    onChange,
    onValidate,
    onKeyDown
}: NumberFieldProps) => {
    const [value, setValue] = useState<string>(() => initialValue?.toString() ?? '');
    const [error, setError] = useState<string | undefined>();
    const [onChangeDebounce, cancelChangeDebounce] = useDebounce((v: number | undefined) => onChange(v), 250);

    const validateChange = (value: string, debounce: boolean = true) => {
        setValue(value);
        cancelChangeDebounce();

        const trimmed = value.trim();
        let saveValue = undefined;
        if (!trimmed) {
            if (required)
                return setError('Please enter a value.');
        } else {
            const parsed = Number(trimmed);
            if (!Number.isFinite(parsed))
                return setError('Please enter a valid number.');
            if (!allowDecimal && !Number.isInteger(parsed))
                return setError('Please enter a whole number.');
            if (min !== undefined && parsed < min)
                return setError(`${label} must be at least ${min}.`);
            if (max !== undefined && parsed > max)
                return setError(`${label} must be at most ${max}.`);
            saveValue = parsed;
        }

        if (onValidate) {
            const custom = onValidate(value);
            if (custom)
                return setError(custom);
        }

        setError(undefined);

        if (debounce)
            onChangeDebounce(saveValue);
        else {
            onChange(saveValue);
            setValue(value);
        }
    };

    const onKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }

        const allowedControlKeys = [
            "Backspace",
            "Delete",
            "Tab",
            "Escape",
            "ArrowLeft",
            "ArrowRight",
            "ArrowUp",
            "ArrowDown",
            "Home",
            "End"
        ];

        if (
            allowedControlKeys.includes(e.key) ||
            e.ctrlKey ||
            e.metaKey
        ) {
            onKeyDown?.(e);
            return;
        }

        const isDigit = /^[0-9]$/.test(e.key);
        const isMinus =
            e.key === "-" &&
            min !== undefined &&
            min < 0 &&
            !e.currentTarget.value.includes("-") &&
            e.currentTarget.selectionStart === 0;

        const isDecimal =
            allowDecimal &&
            e.key === "." &&
            !e.currentTarget.value.includes(".");

        if (!isDigit && !isMinus && !isDecimal) {
            e.preventDefault();
            return;
        }

        onKeyDown?.(e);
    };

    return (
        <div className="flex-1 group relative min-w-35">
            <div
                className={`
                    relative rounded-3xl border 
                    ${error
                        ? 'border-danger-plain focus-within:border-2'
                        : 'border-neutral-border-medium focus-within:border-global-black-white'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
                    bg-neutral-background-strong px-4 ${label !== '' ? 'pt-5 pb-2' : 'pt-3.5 pb-3.5'}
                `}
            >
                <label
                    className={`
                        pointer-events-none absolute left-4 text-sm transition-all
                        text-neutral-content
                        ${value
                        ? "top-1 text-xs"
                        : "top-3.5"
                    }
                        group-focus-within:top-1
                        group-focus-within:translate-y-0
                        group-focus-within:text-xs
                        group-focus-within:line-clamp-1
                    `}
                >
                    {label}
                    {required ? (<span className="text-danger-plain">*</span>) : ''}
                </label>
                <div
                    className={`
                        absolute right-4 flex justify-end items-center gap-1
                        text-sm text-neutral-content transition-all
                        ${value ? "top-1 text-xs" : "top-4"}
                        group-focus-within:top-1
                        group-focus-within:translate-y-0
                        group-focus-within:text-xs
                    `}
                >
                    {description && <DescriptionTooltip text={description} />}
                </div>

                <input
                    type="number"
                    value={value}
                    minLength={min}
                    maxLength={max}
                    onKeyDown={onKeyDownHandler}
                    disabled={disabled}
                    onBlur={e => validateChange(e.target.value, false)}
                    onChange={e => validateChange(e.target.value)}
                    className={`
                        block w-full resize-none overflow-hidden bg-transparent
                        text-sm text-global-black-white outline-none
                        min-h-5 leading-5
                        ${disabled ? 'cursor-not-allowed' : ''}
                    `}
                />
            </div>

            {error && (<div className="text-red-800 dark:text-red-400 px-4">{error}</div>)}
        </div>
    );
};
