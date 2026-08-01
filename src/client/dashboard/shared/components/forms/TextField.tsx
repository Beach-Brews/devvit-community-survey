/*!
 * A helper component for consistent text fields.
 * AI Assisted.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { useLayoutEffect, useRef, useState, KeyboardEvent } from 'react';
import { DescriptionTooltip } from './DescriptionTooltip';
import { useDebounce } from '../../../../shared/debounce';

export type TextFieldProps = {
    label: string;
    description?: string;
    value: string;
    minLength?: number;
    maxLength?: number;
    rows?: number;
    noCount?: boolean;
    required?: boolean;
    disabled?: boolean;
    multiLine?: boolean;
    trim?: boolean;
    onChange: (value: string) => void;
    onFocus?: (value: string) => void;
    onBlur?: (value: string) => void;
    onValidate?: (value: string) => (string|undefined);
    onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

export const TextField = ({
    label,
    description,
    value: initialValue,
    minLength,
    maxLength,
    rows = 1,
    required = false,
    disabled = false,
    multiLine = false,
    noCount = false,
    trim = true,
    onKeyDown,
    onChange,
    onFocus,
    onBlur,
    onValidate
}: TextFieldProps) => {
    const ref = useRef<HTMLTextAreaElement | null>(null);
    const [value, setValue] = useState<string>(() => initialValue);
    const [error, setError] = useState<string | undefined>();
    const [onChangeDebounce, cancelChangeDebounce] = useDebounce((v: string) => onChange(v), 250);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.style.height = "0px";
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    const validateChange = (value: string, debounce: boolean = true) => {
        setValue(value);
        cancelChangeDebounce();

        if (trim)
            value = value.trim();

        if (required && value.length <= 0)
            return setError('Please enter a value.');
        if (minLength && minLength > 0 && value.length <= minLength)
            return setError(`${label} must be at least ${minLength} characters.`);
        if (maxLength && maxLength > 0 && value.length > maxLength)
            return setError(`${label} must be at less than ${maxLength} characters.`);
        if (onValidate) {
            const custom = onValidate(value);
            if (custom)
                return setError(custom);
        }

        setError(undefined);

        if (debounce)
            onChangeDebounce(value);
        else {
            onChange(value);
            setValue(value); // Ensure blur trims
        }
    };

    const onKeyDownHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (!multiLine && e.key === 'Enter') e.preventDefault();
        if (onKeyDown) onKeyDown(e);
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
                        ${value ? "top-1 text-xs" : "top-3.5"}
                        group-focus-within:top-1
                        group-focus-within:translate-y-0
                        group-focus-within:text-xs
                    `}
                >
                    {!noCount && value.length}{!noCount && maxLength && maxLength > 0 && `/${maxLength}`}
                    {description && <DescriptionTooltip text={description} />}
                </div>

                <textarea
                    ref={ref}
                    value={value}
                    disabled={disabled}
                    minLength={minLength}
                    maxLength={maxLength}
                    rows={rows}
                    onKeyDown={onKeyDownHandler}
                    onFocus={e => onFocus ? onFocus(e.target.value) : undefined}
                    onBlur={e => onBlur ? onBlur(e.target.value) : validateChange(e.target.value, false)}
                    onChange={e => validateChange(e.target.value)}
                    style={{
                        minHeight: `calc(${rows} * 1.25rem)`
                    }}
                    className={`
                        block w-full resize-none overflow-hidden bg-transparent
                        text-sm text-global-black-white outline-none leading-5
                        ${disabled ? 'cursor-not-allowed' : ''}
                    `}
                />
            </div>

            {error && (<div className="text-danger-plain px-4">{error}</div>)}
        </div>
    );
};
