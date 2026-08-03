/*!
 * A helper component for consistent text fields.
 * AI Assisted.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { useRef, useState, KeyboardEvent, FocusEvent, useMemo, useLayoutEffect } from 'react';
import { DescriptionTooltip } from './DescriptionTooltip';
import { createPortal } from 'react-dom';

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
    const [value, setValue] = useState<string>(() => '');
    const [focused, setFocused] = useState(false);

    const inputRef = useRef<HTMLDivElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const [pos, setPos] = useState({
        top: 0,
        left: 0,
        placement: "bottom" as "top" | "bottom"
    });

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

    useLayoutEffect(() => {
        if (!focused || disabled || !inputRef.current || !listRef.current) return;

        const margin = 8;
        const input = inputRef.current.getBoundingClientRect();
        const list = listRef.current.getBoundingClientRect();

        let left = input.left;
        let top = input.bottom + margin;
        let placement: "top" | "bottom" = "bottom";

        // Clamp horizontally
        left = Math.max(
            margin,
            Math.min(left, window.innerWidth - list.width - margin)
        );

        // Flip above if bottom would overflow
        if (top + list.height > window.innerHeight - margin) {
            top = input.top - list.height - margin;
            placement = "top";
        }

        // Clamp vertically as fallback
        top = Math.max(
            margin,
            Math.min(top, window.innerHeight - list.height - margin)
        );

        setPos({ top, left, placement });
    }, [focused, disabled, filteredOptions]);

    const onKeyDownHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') e.preventDefault();
        if (onKeyDown) onKeyDown(e);
    };

    const onFocusHandler = (e: FocusEvent<HTMLTextAreaElement>) => {
        setFocused(true);
        if (onFocus) onFocus(e.target.value as T);
    };

    const onBlurHandler = (e: FocusEvent<HTMLTextAreaElement>) => {
        if (!inputRef.current?.contains(e.relatedTarget as Node | null)) {
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
                ref={inputRef}
                className={`
                    relative rounded-3xl border 
                    border-neutral-border-medium focus-within:border-global-black-white
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
                        text-sm text-global-black-white outline-none leading-5
                        min-h-5
                        ${disabled ? 'cursor-not-allowed' : ''}
                    `}
                />
            </div>
            {focused && !disabled && createPortal(
                <div
                    ref={listRef}
                    className="
                        fixed z-50 w-[min(16rem,calc(100vw-1rem))]
                        max-h-64 overflow-auto
                        rounded-md border border-neutral-border-medium
                        bg-neutral-background-weak shadow-lg
                    "
                    style={{
                        top: pos.top,
                        left: pos.left
                    }}
                >
                    {!hasOptions && (
                        <div className="px-3 py-1 text-xs font-semibold uppercase text-neutral-content">
                            No options found
                        </div>
                    )}
                    {Object.entries(filteredOptions).map(([group, items]) => (
                        <div key={group} className="py-1">
                            <div className="px-3 py-1 text-xs font-semibold uppercase text-neutral-content">
                                {group}
                            </div>

                            {items.map((item) => (
                                <button
                                    key={`${group}:${item.value}`}
                                    type="button"
                                    className="
                                        w-full px-3 py-2 text-left text-sm
                                        hover:bg-neutral-background-strong
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
                </div>,
                document.body
            )}
        </div>
    );
};
