/*!
* Displays the options a user can choose for a multiple choice or checkbox question.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { QuestionProps } from './QuestionProps';
import { BulletIcon, CheckboxIcon } from '../../../shared/components/CustomIcons';
import { useState } from 'react';

export const MultiOrCheckboxQuestion = (props: QuestionProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'multi' && qType != 'checkbox')
        throw new Error(`Unexpected question type of '${qType}' when 'multi' or 'checkbox' was expected.`);

    // State for which option is chosen
    const options = props.question.options;
    const optionCount = options.length;
    const response = props?.response;
    const chosenValues: boolean[] = response
        ? options.map(o => response.findIndex(v => v === o.value) >= 0)
        : new Array(optionCount).fill(false);

    // Save the last selected value (for mobile line-clamp)
    const [lastOpt, setLastOpt] = useState<number | undefined>(undefined);

    // Handle saving response to Redis
    const setChosenValues = (s: boolean[]) => {
        const values = s.map((v, i) => (v ? options[i]?.value : undefined))
            .filter((v) => typeof v === 'string');
        props.setResponse(values);
    };

    // Handle on change selection
    const onOptionClick = async (idx: number) => {
        switch (qType) {
            case 'multi': {
                const newState = new Array(optionCount).fill(false);
                newState[idx] = true;
                setChosenValues(newState);
                break;
            }

            case 'checkbox': {
                const newState = [...chosenValues];
                newState[idx] = !newState[idx];
                setChosenValues(newState);
                break;
            }
        }
        setLastOpt(idx);
    };

    // Choose icon based on type
    const optionIcon = (idx: number) => {
        const selected = chosenValues[idx] ?? false;
        return qType === 'multi'
            ? (<BulletIcon fill={selected} />)
            : (<CheckboxIcon fill={selected} />);
    };

    // Helper variable for highlighting
    const lastStyle = `bg-blue-100 dark:bg-blue-950 rounded-md`;

    return (
        <ul className={`flex flex-col text-base ${optionCount > 7 ? 'gap-1' : 'gap-2'}`}>
            {props.question.options.map((o, i) => {
                return (
                    <li key={`sqo_${o.value}`} className={`flex gap-2 items-center cursor-pointer ${chosenValues[i] ? lastStyle : ''}`} onClick={() => void onOptionClick(i)}>
                        {optionIcon(i)}
                        <div className={lastOpt === i ? '' : `line-clamp-1`}>{o.label}</div>
                    </li>
                );
            })}
        </ul>
    );
};
