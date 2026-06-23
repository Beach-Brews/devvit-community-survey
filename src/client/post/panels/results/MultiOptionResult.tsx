/*!
* Displays the results for a Multiple Choice or Checkbox question type.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { PostResultProps } from './PostResultProps';
import { QuestionOptionDto } from '../../../../shared/redis/SurveyDto';
import { renderMarkdown } from '../../../shared/markdown/markdownFlavor';

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

    const total = props.response.total;
    const percentTotal = question.type == 'rank' ? total * sorted.length : total;
    
    return (
        <div className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-2">
            {
                sorted.map((o, i) => {
                    const score = props.response.responses[o.value] ?? 0;
                    const percentage = total > 0 ? Math.floor(score/percentTotal*100) : 0;
                    const row = [
                        (<div key={o.value + '_label'} className="max-w-[150px] text-right">{renderMarkdown(o.label)}</div>)
                    ];
                    if (total == 0 && i == 0) {
                        row.push(
                            <div key="no_result" className="text-center col-span-2" style={{gridColumn: '2', gridRow: `1 / span ${sorted.length}`}}>
                                No Results
                            </div>
                        );
                    }
                    if (total > 0) {
                        row.push(<div key={o.value + '_result'} className="flex-1 grow h-8 p-2 flex justify-start items-center gap-2 font-bold border border-neutral-border rounded-full">
                            <div style={{ width: `${percentage}%`, minWidth: score === 0 ? '0' : '2px' }} className="h-4 bg-survey-primary-border rounded-full flex justify-end items-center whitespace-nowrap">
                            </div>
                        </div>);
                        row.push(
                            <div className="whitespace-nowrap">
                                {score.toLocaleString()} ({percentage}%)
                            </div>
                        );
                    }
                    return row;
                })
            }
            <div className="text-right mt-4">
                Total
            </div>
            <div className="mt-4">
                {total.toLocaleString()}
            </div>
        </div>
    );
};
