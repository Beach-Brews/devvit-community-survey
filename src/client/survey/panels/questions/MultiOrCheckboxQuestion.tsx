/*!
* Displays the options a user can choose for a multiple choice or checkbox question.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { QuestionProps } from './QuestionProps';
import { BulletIcon, CheckboxIcon } from '../../../shared/components/CustomIcons';
import { useCallback, useEffect, useState } from 'react';

export const MultiOrCheckboxQuestion = (props: QuestionProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'multi' && qType != 'checkbox')
        throw new Error(`Unexpected question type of '${qType}' when 'multi' or 'checkbox' was expected.`);

    // State for which option is chosen
    const options = props.question.options;
    const optionCount = options.length;
    const [chosenValues, setChosenValues] = useState<boolean[]>(new Array(optionCount).fill(false))

    // Handle saving response to Redis
    const saveSelections = useCallback(async (s: boolean[]) => {
        // TODO: Save
        const values = s
            .map((v, i) => v ? options[i]?.value : undefined)
            .filter(v => typeof v === 'string');
        console.log(values);
    }, [options]);

    // Trigger valid selection om parent
    const setValidResponse = props.setValidResponse;
    useEffect(() => {
        setValidResponse(chosenValues.some(v => v));
        void saveSelections(chosenValues);
    }, [chosenValues, setValidResponse, saveSelections]);

    // Handle on change selection
    const onOptionClick = async (idx: number) => {
        switch (qType) {
            case 'multi': {
                const newState = new Array(optionCount).fill(false);
                newState[idx] = true;
                setChosenValues(newState);
                break;
            }

            case 'checkbox':
                setChosenValues(prev => {
                    const newState = [...prev];
                    newState[idx] = !newState[idx];
                    return newState;
                });
                break;
        }
    };

    // Choose icon based on type
    const optionIcon = (idx: number) => {
        const selected = chosenValues[idx] ?? false;
        return qType === 'multi'
            ? (<BulletIcon fill={selected} />)
            : (<CheckboxIcon fill={selected} />);
    };

    return (
        <ul className="flex flex-col gap-4">
            {props.question.options.map((o, i) => {
                return (
                    <li key={`sqo_${o.value}`} className="flex gap-2 items-center cursor-pointer" onClick={() => void onOptionClick(i)}>
                        {optionIcon(i)}
                        <div>{o.label}</div>
                    </li>
                );
            })}
        </ul>
    );
};
