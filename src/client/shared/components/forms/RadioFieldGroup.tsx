/*!
 * A helper component for consistent group of checkbox fields.
 * AI Assisted.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { type CheckboxFieldProps, CheckboxFieldGroup } from './CheckboxFieldGroup';

export type RadioFieldProps<T extends string> = Omit<CheckboxFieldProps<T>, 'min' | 'max' | 'onChange' | 'onValidate' | 'noCount'> & {
    required?: boolean;
    onChange: (value: T | undefined) => void;
    onValidate?: (value: T | undefined) => (string|undefined);
};

export const RadioFieldGroup = <T extends string>({
    required,
    onChange,
    onValidate,
    ...checkProps
}: RadioFieldProps<T>) => {

    const onChangeRadio = (values: T[]) => {
        onChange(values[0]);
    };

    const onValidateRadio = (values: T[]) => {
        return onValidate?.(values[0]);
    };

    return (
        <CheckboxFieldGroup
            {...checkProps}
            max={1}
            min={required ? 1 : 0}
            onChange={onChangeRadio}
            onValidate={onValidateRadio}
        />
    );
};
