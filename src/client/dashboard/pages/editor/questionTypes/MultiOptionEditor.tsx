/*!
* Editor for multiple choice, checkbox, and rank questions.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ChangeEvent, FocusEvent } from 'react';
import { CommonQuestionEditorProps } from './commonEditorTypes';
import { QuestionOptionDto } from '../../../../../shared/redis/SurveyDto';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { genOptionId } from '../../../../../shared/redis/uuidGenerator';
import { Constants } from '../../../../../shared/constants';
import { BulletIcon, CheckboxIcon, RankIcon } from '../../../../shared/components/CustomIcons';

export const MultiOptionEditor = (props: CommonQuestionEditorProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'multi' && qType != 'checkbox' && qType != 'rank')
        throw new Error(`Unexpected question type of '${qType}' when 'multi', 'checkbox', or 'rank' was expected.`);

    const q = props.question;

    // Adds a new option to the option list
    const addNewOption = () => {
        q.options.push({
            label: `Option #${q.options.length+1}`,
            value: genOptionId()
        });
        props.modifyQuestion(q);
    };

    // When an option is choosen to be deleted via the (x) button
    const onDeleteOption = (idx: number) => {
        // Create a new option list
        const newList: QuestionOptionDto[] = [];

        // For each option...
        for (let i = 0; i < q.options.length; ++i) {

            // If the option is the option chosen to be deleted, skip
            const o = q.options[i];
            if (!o || i == idx) continue;

            // Otherwise, re-add the option to the option list
            newList.push(o);
        }

        // Force at least one option
        if (newList.length <= 0) {
            newList.push({
                label: `Option #1`,
                value: genOptionId()
            });
        }

        // Then update the option list with the new list
        q.options = newList;
        props.modifyQuestion(q);
    };

    // When an option input value changes, update the value on the question
    const onOptionChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        const o = q.options[i];
        if (!o) return;
        o.label = e.target.value;
        props.modifyQuestion(q);
    };

    // When an option input looses focus, if the value is empty, delete the option
    const onOptionBlur = (e: FocusEvent<HTMLInputElement>, i: number) => {
        if (e.target.value === '')
            onDeleteOption(i);
    };

    // Choose icon based on type
    const optionIcon = (idx: number) => {
        return qType === 'multi'
            ? <BulletIcon fill={idx === 0} />
            : qType === 'checkbox'
                ? <CheckboxIcon fill={idx % 2 === 0 || idx === -1} />
                : <RankIcon />;
    }

    return (
        <ul className="flex flex-col gap-4">
            {q.options.map((o, i) => {
                return (
                    <li key={`sqo_${i}`} className="flex gap-2 items-center">
                        {optionIcon(i)}
                        <input
                            onChange={(e) => onOptionChange(e, i)}
                            onBlur={(e) => onOptionBlur(e, i)}
                            name={`option${i}`}
                            value={o.label}
                            maxLength={64}
                            className="p-2 w-4/5 border-b-1 rounded-sm border-neutral-500 focus:border-1 focus:outline-1 focus:outline-black dark:focus:outline-white"
                        />
                        <div className={`text-xs mt-1 p-1 text-right bg-white dark:bg-neutral-900 ${64-o.label.length <= 15 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{o.label.length} / 64</div>
                        <button
                            onClick={() => onDeleteOption(i)}
                            className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200"
                        >
                            <XCircleIcon className="size-6" />
                        </button>
                    </li>
                );
            })}
            {q.options.length < Constants.MAX_OPTION_COUNT && (
                <li className="flex gap-2 items-center cursor-pointer" onClick={addNewOption}>
                    {optionIcon(-1)}
                    <div className="p-2 border-b-1 rounded-sm">Add new Option</div>
                </li>
            )}
        </ul>
    );
};
