/*!
 * A helper component for consistent select fields.
 * AI Assisted.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { useState } from 'react';
import { DescriptionTooltip } from './DescriptionTooltip';
import { useDebounce } from '../../../../shared/debounce';

export type SelectFieldOption<T extends string> = {
    label: string;
    value: T;
};

export type SelectFieldProps<T extends string> = {
    label: string;
    description?: string;
    value: T;
    options: SelectFieldOption<T>[];
    required?: boolean;
    disabled?: boolean;
    onChange: (value: T) => void;
    onValidate?: (value: string) => (string|undefined);
};

export const SelectField = <T extends string>({
    label,
    description,
    value: initialValue,
    options,
    required = false,
    disabled = false,
    onChange,
    onValidate
}: SelectFieldProps<T>) => {
    const [onChangeDebounce, cancelChangeDebounce] = useDebounce((v: T) => onChange(v), 250);
    const [value, setValue] = useState<string>(() => initialValue);
    const [error, setError] = useState<string | undefined>();

    const validateChange = (value: T, debounce: boolean = true) => {
        setValue(value);
        cancelChangeDebounce();
        if (required && value.length <= 0)
            return setError('Please select a value.');
        if (onValidate) {
            const custom = onValidate(value);
            if (custom)
                return setError(custom);
        }
        setError(undefined);
        if (debounce)
            onChangeDebounce(value);
        else
            onChange(value);
    };

    return (
        <div className="flex-1 relative min-w-35">
            <div className={`relative rounded-3xl border ${error ? 'border-red-700 focus-within:border-2' : 'border-neutral-300 focus-within:border-black dark:border-neutral-700 dark:focus-within:border-white'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} bg-neutral-50 dark:bg-neutral-900 px-4 pt-5 pb-2`}>
                <label
                    className={`
                        pointer-events-none absolute left-4 text-neutral-700 dark:text-neutral-300 transition-all
                        top-2 text-xs ${disabled ? 'cursor-not-allowed' : ''}
                    `}
                >
                    {label}
                    {required ? (<span className="text-red-500">*</span>) : ''}
                </label>

                <select
                    value={value}
                    disabled={disabled}
                    onBlur={e => validateChange(e.target.value as T, false)}
                    onChange={e => validateChange(e.target.value as T)}
                    className="
                        block w-full appearance-none bg-transparent
                        text-sm text-black dark:text-white outline-none
                        min-h-5 leading-5 pr-8 disabled:cursor-not-allowed
                    "
                >
                    {options.map(option => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="px-2 bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="flex gap-2 absolute right-4 top-1 justify-end items-center text-neutral-600 dark:text-neutral-400 text-sm">
                    <span className="pointer-events-none">
                        {'\u25BC'}
                    </span>
                    {description && (<DescriptionTooltip text={description} />)}
                </div>
            </div>
            <div className="flex justify-start px-4">
                <div className="text-red-800 dark:text-red-400">{error}</div>
            </div>
        </div>
    );
};
