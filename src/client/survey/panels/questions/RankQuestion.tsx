/*!
* Displays the options a user can choose for a rank question.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { QuestionProps } from './QuestionProps';
import { useState } from 'react';
import { QuestionOptionDto } from '../../../../shared/redis/SurveyDto';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

export const RankQuestion = (props: QuestionProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'rank')
        throw new Error(`Unexpected question type of '${qType}' when 'rank' was expected.`);

    // State for which option is chosen
    const optionCount = props.question.options.length;
    const [valueOrder, setValueOrder] = useState<QuestionOptionDto[]>(props.question.options);

    // Handle saving response to Redis
    const saveSelections = async (s: string[]) => {
        // TODO: Save
        console.log(s);
    };

    // Handle on change selection
    const onOptionChange = async (idx: number, isUp: boolean) => {
        if ((idx === 0 && isUp) || (idx === optionCount-1 && !isUp)) return;
        setValueOrder(prev => {
            const newState = [...prev];
            const me = newState[idx];
            const newIndex = isUp ? idx-1 : idx+1;
            const other = newState[newIndex];
            if (me && other) {
                newState[idx] = other;
                newState[newIndex] = me;
            }
            void saveSelections(newState.map(o => o.value));
            return newState;
        });
    };

    return (
        <ul className="flex flex-col gap-2 w-full">
            {valueOrder.map((o, i) => {
                return (
                    <li key={`sqo_${o.value}`} className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            <button disabled={i === 0} onClick={() => onOptionChange(i, true)} className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200 disabled:pointer-events-none disabled:opacity-50"><ArrowUpCircleIcon className="size-6" /></button>
                            <button disabled={i === optionCount-1} onClick={() => onOptionChange(i, false)} className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200 disabled:pointer-events-none disabled:opacity-50"><ArrowDownCircleIcon className="size-6" /></button>
                        </div>
                        <div className="flex-grow">{o.label}</div>
                    </li>
                );
            })}
        </ul>
    );
};
