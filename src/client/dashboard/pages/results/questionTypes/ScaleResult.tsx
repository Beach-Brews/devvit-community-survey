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

    const total = props.response.total;

    const options = question.max - question.min + 1;
    return (
        <div className="w-full p-2 border border-neutral-500 rounded-md flex flex-col items-center gap-2">
            <div style={{gridTemplateColumns: `repeat(${options}, minmax(0, 1fr))`}} className="w-full grid items-center gap-2">
                {total == 0 && (
                    <div className="h-[200px] flex justify-center items-center" style={{gridRow: '1', gridColumn: `1 / span ${options}`}}>
                        No Results
                    </div>
                )}
                {
                    Array.from({ length: options }, (_, i) => i + question.min)
                        .map(o => {
                            const score = props.response.responses[o] ?? 0;
                            const percentage = total > 0 ? Math.floor(score/total*100) : 0;
                            return (
                                <div key={o + '_label'} className="flex flex-col gap-2 justify-center items-center">
                                    {total > 0 &&
                                        (<div className="h-[200px] flex flex-col justify-end items-center gap-2">
                                            <div className="font-bold text-center">{score.toLocaleString()} ({percentage}%)</div>
                                            <div style={{ height: `${percentage}%` }} className="min-h-1 w-6 bg-blue-200 dark:bg-blue-800 border border-blue-400 dark:border-blue-600 rounded-md flex justify-end items-center"></div>
                                        </div>
                                    )}
                                    <div>{o}</div>
                                </div>
                            );
                        })
                }
            </div>
            {(question.minLabel.length > 0 || question.midLabel.length > 0 || question.maxLabel.length > 0) && (
                <div className="w-full px-4 mt-2 flex gap-2 justify-between items-center">
                    <div className="w-1/3">{question.minLabel}</div>
                    <div className="w-1/3 text-center">{question.midLabel}</div>
                    <div className="w-1/3 text-right">{question.maxLabel}</div>
                </div>
            )}
            <div className="w-full mt-4">
                    Total: {total.toLocaleString()}
            </div>
        </div>
    );
};
