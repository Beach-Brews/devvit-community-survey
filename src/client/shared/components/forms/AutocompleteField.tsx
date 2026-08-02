/*!
 * A helper component for consistent text fields.
 * AI Assisted.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { useRef, useState, KeyboardEvent, FocusEvent, useMemo } from 'react';
import { DescriptionTooltip } from './DescriptionTooltip';

export type AutocompleteOption<T> = { label: string, value: T };
export type AutocompleteOptions<T> = Record<string, AutocompleteOption<T>[]>;

export type AutocompleteFieldProps<T> = {
    label: string;
    name?: string;
    description?: string;
    options: AutocompleteOptions<T>;
    selected?: T[] | undefined,
    disabled?: boolean;
    onSelect: (value: T) => void;
    onFocus?: (value: T) => void;
    onBlur?: (value: T) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

export const AutocompleteField = <T extends string,>({
    label,
    name,
    description,
    options,
    selected,
    disabled = false,
    onSelect,
    onKeyDown,
    onFocus,
    onBlur
}: AutocompleteFieldProps<T>) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [value, setValue] = useState<string>(() => '');
    const [focused, setFocused] = useState(false);

    const filteredOptions = useMemo(() => {
        const query = value.trim().toLowerCase();
        const skipValues = selected ?? [];

        return Object.entries(options).reduce<AutocompleteOptions<T>>((result, [group, items]) => {
            const filteredItems = query
                ? items.filter(item => item.value.toLowerCase().includes(query) && !skipValues.some(s => s.trim().toLowerCase() == item.value.toLowerCase()))
                : items.filter(item => !skipValues.some(s => s.trim().toLowerCase() == item.value.toLowerCase()));

            if (filteredItems.length > 0) {
                result[group] = filteredItems;
            }

            return result;
        }, {});
    }, [options, value, selected]);
    const hasOptions = Object.keys(filteredOptions).length > 0;

    const onKeyDownHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') e.preventDefault();
        if (onKeyDown) onKeyDown(e);
    };

    const onFocusHandler = (e: FocusEvent<HTMLTextAreaElement>) => {
        setFocused(true);
        if (onFocus) onFocus(e.target.value as T);
    };

    const onBlurHandler = (e: FocusEvent<HTMLTextAreaElement>) => {
        if (!ref.current?.contains(e.relatedTarget as Node | null)) {
            setFocused(false);
        }
        if (onBlur) onBlur(e.target.value as T);
    };

    const onChange = (e: string) => {
        setValue(e);
    };

    return (
        <div className="flex-1 group relative min-w-35">
            <div
                ref={ref}
                className={`relative rounded-3xl border 
                border-neutral-300 focus-within:border-black dark:border-neutral-700 dark:focus-within:border-white
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
                bg-neutral-50 dark:bg-neutral-900 px-4 ${label !== '' ? 'pt-5 pb-2' : 'pt-3.5 pb-3.5'}`}
            >
                <label
                    className={`
                        pointer-events-none absolute left-4 text-sm transition-all
                        ${value ? "top-1 text-xs text-neutral-700 dark:text-neutral-300" : "top-1/2 -translate-y-1/2 text-neutral-600 dark:text-neutral-400"}
                        group-focus-within:top-1
                        group-focus-within:translate-y-0
                        group-focus-within:text-xs
                        group-focus-within:line-clamp-1
                    `}
                >
                    {label}
                </label>
                <div
                    className={`
                        absolute right-4 flex justify-end items-center gap-1
                        text-sm text-neutral-700 dark:text-neutral-300 transition-all
                        ${value ? "top-1 text-xs" : "top-1/2 -translate-y-1/2"}
                        group-focus-within:top-1
                        group-focus-within:translate-y-0
                        group-focus-within:text-xs
                    `}
                >
                    {description && <DescriptionTooltip text={description} />}
                </div>

                <textarea
                    name={name ?? label}
                    value={value}
                    disabled={disabled}
                    rows={1}
                    onKeyDown={onKeyDownHandler}
                    onFocus={onFocusHandler}
                    onBlur={onBlurHandler}
                    onChange={e => onChange(e.target.value)}
                    className={`
                        block w-full resize-none overflow-hidden bg-transparent
                        text-sm text-black dark:text-white outline-none
                        min-h-5 leading-5
                        ${disabled ? 'cursor-not-allowed' : ''}
                    `}
                />
            </div>
            {focused && !disabled && (
                <div
                    className="
                        absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-auto
                        rounded-md border border-neutral-400 bg-white shadow-lg
                        dark:border-neutral-600 dark:bg-neutral-900
                    "
                >
                    {!hasOptions && (
                        <div className="px-3 py-1 text-xs font-semibold uppercase text-neutral-500">
                            No options found
                        </div>
                    )}
                    {Object.entries(filteredOptions).map(([group, items]) => (
                        <div key={group} className="py-1">
                            <div className="px-3 py-1 text-xs font-semibold uppercase text-neutral-500">
                                {group}
                            </div>

                            {items.map((item) => (
                                <button
                                    key={`${group}:${item}`}
                                    type="button"
                                    className="
                                        w-full px-3 py-2 text-left text-sm
                                        hover:bg-neutral-100
                                        dark:hover:bg-neutral-800
                                        cursor-pointer
                                    "
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        onChange('');
                                        onSelect(item.value);
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
