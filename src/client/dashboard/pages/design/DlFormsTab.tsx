/*!
* The forms tab for the Design Language, showing various form inputs.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { NumberField, TextField } from '../../shared/components/forms';

export const DlFormsTab = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1>Forms</h1>
            <h2>Text</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between">
                <TextField label="Text Input" description="A simple text input example" value="Sample text input" onChange={() => {}} />
                <TextField label="Text Input" description="A simple text input example" value="Sample text input" disabled={true} onChange={() => {}} />
                <TextField label="Text Input" description="A simple text input example" value="" required={true} minLength={5} maxLength={10} onChange={() => {}} />
            </div>
            <h2>Text Area</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between">
                <TextField label="Text Area" description="A simple text area example" multiLine={true} rows={5} value="Sample text area value to demonstrate what multiple lines looks like." onChange={() => {}} />
                <TextField label="Text Area" description="A simple text area example" multiLine={true} rows={5} value="Sample text area value to demonstrate what multiple lines looks like." disabled={true} onChange={() => {}} />
                <TextField label="Text Area" description="A simple text area example" multiLine={true} rows={5} value="" required={true} minLength={5} maxLength={10} onChange={() => {}} />
            </div>
            <h2>Numbers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 justify-between">
                <NumberField label="Number Input" description="A simple number input example" value={undefined} allowDecimal={true} onChange={() => {}} />
                <NumberField label="Number Input" description="A simple number input example" value={234} allowDecimal={true} disabled={true} onChange={() => {}} />
            </div>
        </div>
    );
};
