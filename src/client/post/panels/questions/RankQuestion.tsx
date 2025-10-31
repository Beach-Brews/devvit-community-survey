/*!
* Displays the options a user can choose for a rank question.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { QuestionProps } from './QuestionProps';
import { QuestionOptionDto } from '../../../../shared/redis/SurveyDto';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export const RankQuestion = (props: QuestionProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'rank')
        throw new Error(`Unexpected question type of '${qType}' when 'rank' was expected.`);

    // State for last selected option + direction (highlight button for easy finding)
    const [lastOpt, setLastOpt] = useState<[number, boolean] | undefined>(undefined);

    // State for which option is chosen
    const options = props.question.options;
    const optionCount = options.length;
    const valueOrder: QuestionOptionDto[] = props?.response
        ? props.response.map(r => options.find(o => o.value === r))
            .filter(r => !!r)
        : options;

    // Handle on change selection
    const onOptionChange = async (idx: number, isUp: boolean) => {
        if ((idx === 0 && isUp) || (idx === optionCount-1 && !isUp)) return;
        const newState = [...valueOrder];
        const me = newState[idx];
        const newIndex = isUp ? idx-1 : idx+1;
        const other = newState[newIndex];
        if (me && other) {
            newState[idx] = other;
            newState[newIndex] = me;
        }
        props.setResponse(newState.map(o => o.value));
        setLastOpt([newIndex, isUp]);
    };

    const buttonStyle = 'p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200 disabled:pointer-events-none disabled:opacity-50';
    const lastStyle = `bg-blue-100 dark:bg-blue-950 rounded-md`;

    return (
        <ul className="flex flex-col w-full">
            {valueOrder.map((o, i) => {
                const lineStyle = lastOpt?.[0] === i ? lastStyle : '';
                return (
                    <li key={`sqo_${o.value}`} className={`text-sm md:text-base flex gap-2 items-center ${lineStyle}`}>
                        <div className="flex gap-2">
                            <button disabled={i === 0} onClick={() => onOptionChange(i, true)} className={buttonStyle}><ArrowUpCircleIcon className="size-5 md:size-6" /></button>
                            <button disabled={i === optionCount-1} onClick={() => onOptionChange(i, false)} className={buttonStyle}><ArrowDownCircleIcon className="size-5 md:size-6" /></button>
                        </div>
                        <div className="flex-grow line-clamp-1">{o.label}</div>
                    </li>
                );
            })}
        </ul>
    );
};
