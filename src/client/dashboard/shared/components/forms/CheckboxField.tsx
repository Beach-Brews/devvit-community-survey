/*!
 * A helper component for consistent checkbox fields.
 * AI Assisted.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { useState } from 'react';
import { DescriptionTooltip } from './DescriptionTooltip';

export type CheckboxFieldProps = {
    label: string;
    description?: string;
    checked: boolean | undefined;
    disabled?: boolean;
    allowUndefined?: boolean;
    onChange: (checked: boolean | undefined) => void;
    onValidate?: (value: boolean | undefined) => (string|undefined);
};

export const CheckboxField = ({
    label,
    description,
    checked: initialChecked,
    disabled = false,
    allowUndefined = false,
    onChange,
    onValidate
}: CheckboxFieldProps) => {
    const [checked, setChecked] = useState<boolean | undefined>(() => (initialChecked ?? (allowUndefined ? undefined : false)));
    const [error, setError] = useState<string | undefined>();

    const validateChange = (value: boolean | undefined) => {
        setChecked(value);
        if (onValidate) {
            const custom = onValidate(value);
            if (custom)
                return setError(custom);
        }
        setError(undefined);
        onChange(value);
    };

    const toggle = () => {
        if (disabled) return;

        if (allowUndefined) {
            if (checked === undefined)
                validateChange(true);
            else if (checked)
                validateChange(false);
            else
                validateChange(undefined);
        } else {
            validateChange(!checked);
        }
    };

    const stateLabel =
        checked === undefined
            ? ""
            : checked
                ? "Yes"
                : "No";

    const trackClass =
        checked === undefined
            ? "bg-neutral-400 dark:bg-neutral-600"
            : checked
                ? (disabled ? "bg-neutral-500 text-left" : "bg-alienblue-500 text-left")
                : "bg-neutral-500 dark:bg-neutral-700 justify-end";

    const thumbClass =
        checked === undefined
            ? "translate-x-4 bg-neutral-100 dark:bg-neutral-200"
            : checked
                ? "translate-x-8 bg-white"
                : "translate-x-0 bg-neutral-200 dark:bg-neutral-400";

    return (
        <div className="relative min-w-35">
            <div className="flex items-center gap-2">
                <div
                    className={`
                    group flex items-center justify-between gap-2 select-none
                    ${disabled
                        ? "opacity-50 cursor-not-allowed disabled"
                        : "cursor-pointer"}
                `}
                >
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={toggle}
                        className="relative shrink-0"
                        aria-label={label}
                        aria-pressed={checked === true}
                    >
                        <div
                            className={`
                            h-7 w-15 rounded-full transition-colors
                            text-white text-xs px-3 flex items-center
                            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                            ${trackClass}
                        `}
                        >
                            {stateLabel}
                        </div>

                        <div
                            className={`
                            absolute left-1 top-1
                            size-5 rounded-full
                            transition-transform
                            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                            ${thumbClass}
                        `}
                        />
                    </button>

                    <button
                        type="button"
                        disabled={disabled}
                        onClick={toggle}
                        className={`flex gap-2 items-center min-w-0 text-left ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        <span className="text-sm text-black dark:text-white">
                            {label}
                        </span>
                    </button>
                </div>

                {description && (
                    <DescriptionTooltip text={description} />
                )}
            </div>

            <div className="flex justify-start px-4">
                <div className="text-red-800 dark:text-red-400">
                    {error}
                </div>
            </div>
        </div>
    );
};
