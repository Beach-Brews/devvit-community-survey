/*!
* Displays the results for a scale question type.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { DashResultProps } from './DashResultProps';

export const ScaleResult = (props: DashResultProps) => {
    const question = props.question;
    if (question.type != 'scale')
        throw new Error(`Unexpected question type of ${props.question.type}. Expected 'scale'.`);

    const options = question.max - question.min + 1;
    return (
        <div className="w-full p-2 border border-neutral-500 rounded-md flex flex-col items-center gap-2">
            <div style={{gridTemplateColumns: `repeat(${options}, minmax(0, 1fr))`}} className="w-full grid items-center gap-2">
                {
                    Array.from({ length: options }, (_, i) => i + question.min).map(o => {
                        const score = props.response.responses[o] ?? 0;
                        const percentage = Math.floor(score/props.response.total*100);
                        return (
                            <div key={o + '_label'} className="flex flex-col gap-2 justify-center items-center">
                                <div className="h-[200px] flex flex-col justify-end items-center gap-2">
                                    <div className="font-bold">{score.toLocaleString()} ({percentage}%)</div>
                                    <div style={{ height: `${percentage}%` }} className="min-h-1 w-6 bg-blue-200 dark:bg-blue-800 border border-blue-400 dark:border-blue-600 rounded-md flex justify-end items-center"></div>
                                </div>
                                <div>{o}</div>
                            </div>
                        );
                    })
                }
            </div>
            <div className="w-full mt-4">
                    Total: {props.response.total.toLocaleString()}
            </div>
        </div>
    );
};
