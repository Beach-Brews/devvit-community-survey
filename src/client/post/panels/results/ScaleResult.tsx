/*!
* Displays the results for a scale question type.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { PostResultProps } from './PostResultProps';

export const ScaleResult = (props: PostResultProps) => {
    const question = props.question;
    if (question.type != 'scale')
        throw new Error(`Unexpected question type of ${props.question.type}. Expected 'scale'.`);

    const total = props.response.total;

    const options = question.max - question.min + 1;
    return (
        <div className="h-full flex flex-col justify-between items-center">
            {total == 0 && (
                <div className="w-full flex-grow h-[0%] flex flex-col items-center gap-2">
                    <div className="flex-grow h-[0%] flex justify-center items-center" style={{gridRow: '1', gridColumn: `1 / span ${options}`}}>
                        No Results
                    </div>
                    <div className="flex w-full justify-between items-center">
                        {
                            Array.from({ length: options }, (_, i) => i + question.min)
                                .map(o => {
                                    return (
                                        <div key={o + '_label'} className="flex flex-col gap-2 justify-center items-center">
                                            {o}
                                        </div>
                                    );
                                })
                        }
                    </div>
                </div>
            )}
            {total > 0 && (
                <div style={{gridTemplateColumns: `repeat(${options}, minmax(0, 1fr))`}} className="w-full flex-grow h-[0%] grid items-center gap-2">
                    {Array.from({ length: options }, (_, i) => i + question.min)
                        .map(o => {
                            const score = props.response.responses[o] ?? 0;
                            const percentage = Math.floor(score/props.response.total*100);
                            return (
                                <div key={o + '_label'} className="h-full flex flex-col gap-2 justify-center items-center">
                                    {total > 0 && (
                                        <div className="h-full flex flex-col justify-end items-center gap-2">
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
            )}
            {(question.minLabel.length > 0 || question.midLabel.length > 0 || question.maxLabel.length > 0) && (
                <div className="w-full mt-2 flex gap-2 justify-between items-center">
                    <div className="w-1/3">{question.minLabel}</div>
                    <div className="w-1/3 text-center">{question.midLabel}</div>
                    <div className="w-1/3 text-right">{question.maxLabel}</div>
                </div>
            )}
            <div className="w-full mt-2">
                    Total: {total.toLocaleString()}
            </div>
        </div>
    );
};
