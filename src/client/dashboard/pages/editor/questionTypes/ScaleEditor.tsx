/*!
* Editor for scale questions.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { CommonQuestionEditorProps } from './commonEditorTypes';
import React, { ChangeEvent, JSX } from 'react';
import { ScaleKind } from '../../../../../shared/redis/SurveyDto';
import { BulletIcon } from '../../../../shared/components/CustomIcons';

export const ScaleEditor = (props: CommonQuestionEditorProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'scale')
        throw new Error(`Unexpected question type of '${qType}' when 'scale' was expected.`);

    const q = props.question;

    const onChangeKind = (e: React.ChangeEvent<HTMLSelectElement>) => {
        q.kind = e.target.value as ScaleKind;
        q.min = 1;
        q.max = q.kind == 'ott' ? 10 : 5;
        props.modifyQuestion(q);
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const fieldName = e.target.name;
        const value = e.target.value;
        props.modifyQuestion({
            ...q,
            [fieldName]: value
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
                <label>Scale Kind:</label>
                <select value={q.kind} onChange={onChangeKind} className="border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white px-2 py-1 [&_option]:dark:bg-neutral-900 [&_option]:dark:text-neutral-300">
                    <option value="otf">1 - 5</option>
                    <option value="ott">1 - 10</option>
                </select>
            </div>
            <div className="flex justify-between gap-4 items-center">
                <div className="w-1/3 flex flex-col">
                    <div className="w-full flex justify-between">
                        <label htmlFor={`q_${q.id}_min`}>Min Label</label>
                        <div className={`text-xs mt-1 p-1 text-right bg-white dark:bg-neutral-900 ${32-q.minLabel.length <= 10 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{q.minLabel.length} / 32</div>
                    </div>
                    <input
                        id={`q_${q.id}_min`}
                        onChange={(e) => onInputChange(e)}
                        name="minLabel"
                        value={q.minLabel}
                        maxLength={32}
                        className="w-full p-2 border-1 rounded-sm border-neutral-500 focus:border-1 focus:outline-1 focus:outline-black dark:focus:outline-white"
                    />
                </div>
                <div className="w-1/3 flex flex-col">
                    <div className="w-full flex justify-between">
                        <label htmlFor={`q_${q.id}_mid`}>Mid Label</label>
                        <div className={`text-xs mt-1 p-1 text-right bg-white dark:bg-neutral-900 ${32-q.midLabel.length <= 10 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{q.midLabel.length} / 32</div>
                    </div>
                    <input
                        id={`q_${q.id}_mid`}
                        onChange={(e) => onInputChange(e)}
                        name="midLabel"
                        value={q.midLabel}
                        maxLength={32}
                        className="w-full p-2 border-1 rounded-sm border-neutral-500 focus:border-1 focus:outline-1 focus:outline-black dark:focus:outline-white"
                    />
                </div>
                <div className="w-1/3 flex flex-col">
                    <div className="w-full flex justify-between">
                        <label htmlFor={`q_${q.id}_max`}>Max Label</label>
                        <div className={`text-xs mt-1 p-1 text-right bg-white dark:bg-neutral-900 ${32-q.maxLabel.length <= 10 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{q.maxLabel.length} / 32</div>
                    </div>
                    <input
                        id={`q_${q.id}_max`}
                        onChange={(e) => onInputChange(e)}
                        name="maxLabel"
                        value={q.maxLabel}
                        maxLength={32}
                        className="w-full p-2 border-1 rounded-sm border-neutral-500 focus:border-1 focus:outline-1 focus:outline-black dark:focus:outline-white"
                    />
                </div>
            </div>
            <div className="flex justify-between items-center px-8">
                {(() => {
                    const mock: JSX.Element[] = [];
                    for (let i = q.min; i <= q.max; ++i) {
                        mock.push(<div key={`rank_${i}`} className="text-center"><BulletIcon fill={false} /> {i}</div>);
                    }
                    return mock;
                })()}
            </div>
        </div>
    );
};
