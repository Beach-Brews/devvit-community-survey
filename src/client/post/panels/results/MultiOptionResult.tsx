/*!
* Displays the results for a Multiple Choice or Checkbox question type.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { PostResultProps } from './PostResultProps';
import { QuestionOptionDto } from '../../../../shared/redis/SurveyDto';

export const MultiOptionResult = (props: PostResultProps) => {
    const question = props.question;
    if (question.type != 'multi' && question.type != 'checkbox' && question.type != 'rank')
        throw new Error(`Unexpected question type of ${props.question.type}. Expected 'multi', 'checkbox', or 'rank'.`);

    const sortCallback = (a: QuestionOptionDto, b: QuestionOptionDto) => {
        return (props.response.responses[b.value] ?? 0) - (props.response.responses[a.value] ?? 0);
    };

    const sorted = question.type == 'rank'
        ? question.options.sort(sortCallback)
        : question.options;

    const resultTextThreshold = 75;

    return (
        <div className="w-full grid grid-cols-[auto_1fr] items-center gap-1">
            {
                sorted.map(o => {
                    const score = props.response.responses[o.value] ?? 0;
                    const percentage = Math.floor(score/props.response.total*100);
                    return (
                        <>
                            <div key={o.value + '_label'} className="max-w-[150px] text-right">{o.label}</div>
                            <div key={o.value + '_result'} className="w-full p-2 flex justify-start items-center gap-2 font-bold">
                                <div style={{ width: `${percentage}%` }} className="min-w-1 h-6 bg-blue-200 dark:bg-blue-800 border border-blue-400 dark:border-blue-600 rounded-md flex justify-end items-center whitespace-nowrap">
                                    {percentage >= resultTextThreshold && (
                                        <div className="px-2">
                                            {score.toLocaleString()} ({percentage}%)
                                        </div>
                                    )}
                                </div>
                                {percentage < resultTextThreshold && (
                                    <div className="whitespace-nowrap">
                                        {score.toLocaleString()} ({percentage}%)
                                    </div>
                                )}
                            </div>
                        </>
                    );
                })
            }
            <div className="max-w-[150px] text-right mt-4">
                Total
            </div>
            <div className="mt-4">
                {props.response.total.toLocaleString()}
            </div>
        </div>
    );
};
