/*!
 * A helper component for consistent group of checkbox fields.
 * AI Assisted.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { useMemo, useState } from 'react';
import { DescriptionTooltip } from './DescriptionTooltip';
import { useDebounce } from '../../debounce';
import { CheckboxIcon } from '../CustomIcons';

export type CheckboxFieldOption<T extends string> = {
    label: string;
    value: T;
    description?: string;
    disabled?: boolean;
    checked?: boolean;
};

export type CheckboxFieldProps<T extends string> = {
    label?: string;
    description?: string;
    name?: string;
    options: CheckboxFieldOption<T>[];
    disabled?: boolean;
    noCount?: boolean;
    min?: number;
    max?: number;
    onChange: (value: T[]) => void;
    onValidate?: (value: T[]) => (string|undefined);
};

export const CheckboxFieldGroup = <T extends string>({
    label,
    description,
    name,
    options,
    disabled,
    noCount,
    min = 0,
    max = 0,
    onChange,
    onValidate
}: CheckboxFieldProps<T>) => {
    const [onChangeDebounce, cancelChangeDebounce] = useDebounce((v: T[]) => onChange(v), 250);
    const [values, setValues] = useState<T[]>(() => options
        .filter(o => o.checked)
        .reduce((v, o) => [...v, o.value], [] as T[])
    );

    const error = useMemo(() => {
        cancelChangeDebounce();
        if (values.length < min)
            return `Please select at least ${min} option${min > 1 && 's'}.`;
        if (max > 0 && values.length > max)
            return `You may only select at most ${max} options.`;
        if (onValidate) {
            const custom = onValidate(values);
            if (custom)
                return custom;
        }
        onChangeDebounce(values);
        return undefined;
    }, [values, min, max, cancelChangeDebounce, onValidate, onChangeDebounce]);

    const onSelect = (value: T) => {
        setValues(vs => vs.indexOf(value) <= -1
            ? [...vs, value]
            : [...vs].filter(v => v !== value)
        );
    };

    return (
        <div className="flex-1 relative min-w-35">
            {label && (
                <div
                    className={`
                        flex items-center gap-2
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <label
                        className={`
                            text-neutral-content
                            ${disabled ? 'cursor-not-allowed' : ''}
                        `}
                    >
                        {label}
                    </label>
                    <div
                        className={`
                            flex justify-end items-center gap-1
                            text-neutral-content text-xs
                        `}
                    >
                        {!noCount && (
                            <span>{min} - {max > 0 && max <= options.length ? max : options.length}</span>
                        )}
                        {description && <DescriptionTooltip text={description} />}
                    </div>
                </div>
            )}
            <div className="flex justify-start">
                <div className="text-danger-plain">{error}</div>
            </div>
            <div className="flex flex-col">
                {options.map(o => {
                    const selected = values.indexOf(o.value) >= 0;
                    return (
                        <div
                            key={o.value}
                            className={`
                                p-2 flex items-center gap-1
                                ${disabled || o.disabled ? 'opacity-50 cursor-not-allowed' : 'group cursor-pointer'}
                            `}
                            onClick={() => !disabled && !o.disabled ? onSelect(o.value) : null}
                        >
                            <div
                                className={`
                                    size-6 flex items-center
                                    ${disabled || o.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                    ${error
                                        ? (selected
                                            ? 'text-danger-plain group-hover:text-danger-plain-hovered'
                                            : (values.length > max ? 'group-hover:text-danger-plain-hovered' : 'group-hover:text-neutral-content-weak'))
                                        : (selected 
                                            ? 'text-global-black-white group-hover:text-neutral-content' 
                                            : 'group-hover:text-neutral-content-weak')
                                    }
                                `}
                            >
                                <CheckboxIcon fill={selected} />
                            </div>
                            <div
                                className={`
                                    wrap-anywhere
                                    ${disabled || o.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {o.label}
                            </div>
                            <input type="checkbox" disabled={disabled || o.disabled} name={name} value={o.value} checked={selected} className="hidden" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
