/*!
* The forms tab for the Design Language, showing various form inputs.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {
    CollapsableFieldGroup,
    NumberField,
    SelectField,
    SelectFieldOption,
    TextField,
    ToggleField,
} from '../../../shared/components/forms';
import { CheckboxFieldGroup } from '../../../shared/components/forms/CheckboxFieldGroup';
import { RadioFieldGroup } from '../../../shared/components/forms/RadioFieldGroup';
import { AutocompleteField } from '../../../shared/components/forms/AutocompleteField';

const testOptions = [
    { label: "First Option", value: "o1" },
    { label: "Second Option", value: "o2" },
    { label: "Third Option", value: "o3" },
] satisfies SelectFieldOption<string>[];

export const DlFormsTab = () => {
    return (
        <div className="flex flex-col gap-8">
            <h1>Forms</h1>
            <h2>Text</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between">
                <TextField label="Text Input" description="A simple text input example" value="Sample text input" onChange={() => {}} />
                <TextField label="Text Input" description="A simple text input example" value="Sample text input" disabled={true} onChange={() => {}} />
                <TextField label="Text Input" description="A simple text input example" value="" required={true} minLength={5} maxLength={10} onChange={() => {}} />
            </div>
            <h2>Text Area</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between my-4">
                <TextField label="Text Area" description="A simple text area example" multiLine={true} rows={5} value="Sample text area value to demonstrate what multiple lines looks like." onChange={() => {}} />
                <TextField label="Text Area" description="A simple text area example" multiLine={true} rows={5} value="Sample text area value to demonstrate what multiple lines looks like." disabled={true} onChange={() => {}} />
                <TextField label="Text Area" description="A simple text area example" multiLine={true} rows={5} value="" required={true} minLength={5} maxLength={10} onChange={() => {}} />
            </div>
            <h2>Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between my-4">
                <NumberField label="Number Input" description="A simple number input example" value={undefined} allowDecimal={true} onChange={() => {}} />
                <NumberField label="Number Input" description="A simple number input example" value={234} allowDecimal={true} disabled={true} onChange={() => {}} />
                <NumberField label="Number Input" description="A simple number input example" value={undefined} required={true} allowDecimal={true} min={5} max={10} onChange={() => {}} />
            </div>
            <h2>Dropdown Select</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between my-4">
                <SelectField label="Dropdown Select" description="A simple dropdown select example" value={testOptions[0]!.value} options={testOptions} onChange={() => {}} />
                <SelectField label="Dropdown Select" description="A simple dropdown select example" value={testOptions[1]!.value} disabled={true} options={testOptions} onChange={() => {}} />
                <SelectField label="Dropdown Select" description="A simple dropdown select example" value={""} options={[{label: "Choose an Option", value: ""}]} required={true} onChange={() => {}} />
            </div>
            <h2>Toggle Option</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between my-4">
                <ToggleField label="Toggle Field" description="A simple toggle option example" onLabel="On" offLabel="Off" checked={undefined} allowUndefined={true} onChange={() => {}} />
                <ToggleField label="Toggle Field" description="A simple toggle option example" checked={true} allowUndefined={true} disabled={true} onChange={() => {}} />
                <ToggleField label="Toggle Field" description="A simple toggle option example" checked={false} onChange={() => {}} />
            </div>
            <h2>Checkbox</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between my-4">
                <CheckboxFieldGroup
                    label="Sample Group of Checkboxes"
                    description="A simple example of a checkbox group"
                    options={[
                        { label: 'Foo Bar', value: 'op1', description: 'Sample option description' },
                        { label: 'Hello World', value: 'op2', description: 'Sample option description', checked: true },
                        { label: 'Another Option', value: 'op3', description: 'Sample option description', disabled: true },
                    ]}
                    onChange={() => {}}
                />
                <CheckboxFieldGroup
                    disabled={true}
                    label="Sample Group of Checkboxes"
                    description="A simple example of a checkbox group"
                    options={[
                        { label: 'Foo Bar', value: 'op1', description: 'Sample option description' },
                        { label: 'Hello World', value: 'op2', description: 'Sample option description', checked: true },
                        { label: 'Another Option', value: 'op3', description: 'Sample option description', disabled: true },
                    ]}
                    onChange={() => {}}
                />
                <CheckboxFieldGroup
                    min={2}
                    label="Sample Group of Checkboxes"
                    description="A simple example of a checkbox group"
                    options={[
                        { label: 'Foo Bar', value: 'op1', description: 'Sample option description' },
                        { label: 'Hello World', value: 'op2', description: 'Sample option description', checked: false },
                        { label: 'Another Option', value: 'op3', description: 'Sample option description', checked: false },
                    ]}
                    onChange={() => {}}
                />
            </div>
            <h2>Radio Button</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between my-4">
                <RadioFieldGroup
                    label="Sample Group of Radio Buttons"
                    description="A simple example of a radio button group"
                    options={[
                        { label: 'Foo Bar', value: 'op1', description: 'Sample option description' },
                        { label: 'Hello World', value: 'op2', description: 'Sample option description', checked: true },
                        { label: 'Another Option', value: 'op3', description: 'Sample option description', disabled: true },
                    ]}
                    onChange={() => {}}
                />
                <RadioFieldGroup
                    disabled={true}
                    label="Sample Group of Radio Buttons"
                    description="A simple example of a radio button group"
                    options={[
                        { label: 'Foo Bar', value: 'op1', description: 'Sample option description' },
                        { label: 'Hello World', value: 'op2', description: 'Sample option description', checked: true },
                        { label: 'Another Option', value: 'op3', description: 'Sample option description', disabled: true },
                    ]}
                    onChange={() => {}}
                />
                <RadioFieldGroup
                    required={true}
                    label="Sample Group of Radio Buttons"
                    description="A simple example of a radio button group"
                    options={[
                        { label: 'Foo Bar', value: 'op1', description: 'Sample option description' },
                        { label: 'Hello World', value: 'op2', description: 'Sample option description' },
                        { label: 'Another Option', value: 'op3', description: 'Sample option description' },
                    ]}
                    onChange={() => {}}
                />
            </div>
            <h2>Autocomplete</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between my-4">
                <AutocompleteField
                    label="Autocomplete Input"
                    description="A simple autocomplete input"
                    options={{
                        'Test': [
                            { label: 'Foo', value: 'foo' },
                            { label: 'Bar', value: 'bar' },
                        ],
                        'Another': [
                            { label: 'Hello', value: 'hello' },
                            { label: 'World', value: 'world' },
                        ],
                    }}
                    onSelect={() => {}}
                />
            </div>
            <h2>Field Group</h2>
            <CollapsableFieldGroup label="Group of Fields" expand={true}>
                <TextField label="Text Input" value={''} onChange={() => {}} />
                <TextField label="Text Area" multiLine={true} rows={8} value={''} onChange={() => {}} />
                <ToggleField label="Test" checked={false} onChange={() => {}} />
            </CollapsableFieldGroup>
        </div>
    );
};
