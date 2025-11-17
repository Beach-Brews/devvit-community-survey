/*!
* Displays the results for a Multiple Choice or Checkbox question type.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { DashResultProps } from './DashResultProps';
import { QuestionOptionDto } from '../../../../../shared/redis/SurveyDto';

export const MultiOptionResult = (props: DashResultProps) => {
    const question = props.question;
    if (question.type != 'multi' && question.type != 'checkbox' && question.type != 'rank')
        throw new Error(`Unexpected question type of ${props.question.type}. Expected 'multi', 'checkbox', or 'rank'.`);

    const sortCallback = (a: QuestionOptionDto, b: QuestionOptionDto) => {
        return (props.response.responses[b.value] ?? 0) - (props.response.responses[a.value] ?? 0);
    };

    const sorted = question.type == 'rank'
        ? question.options.sort(sortCallback)
        : question.options;

    const total = props.response.total;
    const percentTotal = question.type == 'rank' ? total * sorted.length : total;
    const resultTextThreshold = 75;

    return (
        <div className="w-full p-2 border border-neutral-500 rounded-md grid grid-cols-[auto_1fr] items-center gap-2">
            {
                sorted.map((o, i) => {
                    const score = props.response.responses[o.value] ?? 0;
                    const percentage = total > 0 ? Math.floor(score/percentTotal*100) : 0;
                    const row = [
                        (<div key={o.value + '_label'} className="max-w-[300px] text-right">{o.label}</div>)
                    ];
                    if (total == 0 && i == 0) {
                        row.push(
                            <div key="no_result" className="text-center" style={{gridColumn: '2', gridRow: `1 / span ${sorted.length}`}}>
                                No Results
                            </div>
                        );
                    }
                    if (total > 0) {
                        row.push(<div key={o.value + '_result'} className="w-full p-2 flex justify-start items-center gap-2 font-bold">
                            <div style={{ width: `${percentage}%` }} className="min-w-1 h-6 bg-blue-200 dark:bg-blue-800 border border-blue-400 dark:border-blue-600 rounded-md flex justify-end items-center whitespace-nowrap">
                                {percentage >= resultTextThreshold && (
                                    <div className="px-2">
                                        {score.toLocaleString()} ({percentage}%)
                                    </div>
                                )}
                            </div>
                            {total > 0 && percentage < resultTextThreshold && (
                                <div className="whitespace-nowrap">
                                    {score.toLocaleString()} ({percentage}%)
                                </div>
                            )}
                        </div>);
                    }
                    return row;
                })
            }
            <div className="max-w-[150px] text-right mt-4">
                Total
            </div>
            <div className="mt-4">
                {total.toLocaleString()}
            </div>
        </div>
    );
};
