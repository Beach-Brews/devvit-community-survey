/*!
* Represents a single survey question result on a survey.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyQuestionDto } from '../../../../shared/redis/SurveyDto';
import { MultiOptionResult } from './questionTypes/MultiOptionResult';
import { QuestionResponseDto } from '../../../../shared/redis/ResponseDto';
import { ScaleResult } from './questionTypes/ScaleResult';

export interface SurveyResultCardProps {
    question: SurveyQuestionDto;
    response: QuestionResponseDto | undefined;
}

export const SurveyResultCard = (props: SurveyResultCardProps) => {

    const resultValues = () => {
        const response = props.response ?? {
            total: 0,
            responses: {}
        } as QuestionResponseDto;
        switch (props.question.type) {
            case "multi":
            case "checkbox":
            case "rank":
                return <MultiOptionResult question={props.question} response={response} />;
            case "scale":
                return <ScaleResult question={props.question} response={response} />;
            default:
                return (<div>Results for {props.question.type} not yet supported.</div>);
        }
    };

    return (
        <div className="flex p-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white dark:bg-neutral-900 border-1 border-neutral-300 dark:border-neutral-700">
            <div className="w-full text-sm flex flex-col gap-4">
                <h2 className="text-lg font-bold">{props.question.title}</h2>
                {resultValues()}
            </div>
        </div>
    );
};
