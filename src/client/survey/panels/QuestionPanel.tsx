/*!
* Renders a question to the user.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext, useState } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { ErrorPanel } from './ErrorPanel';
import { MultiOrCheckboxQuestion } from './questions/MultiOrCheckboxQuestion';
import { RankQuestion } from './questions/RankQuestion';
import { ScaleQuestion } from './questions/ScaleQuestion';

export const QuestionPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    // Get question
    const totalQs = ctx.survey.questions.length;
    const qNo = ctx.panelContext.number;
    const isLast = qNo == totalQs-1;
    const question = qNo !== undefined && qNo < totalQs
        ? ctx.survey.questions[qNo]
        : undefined;

    // State for whether a valid response has been given (rank is always valid)
    const [validResponse, setValidResponse] = useState<boolean>(question?.type === 'rank');

    // If question is undefined, return error screen
    if (qNo === undefined || !question) {
        return (<ErrorPanel />);
    }

    // Todo: save responses automatically? or on transition? wait to transition?
    // Todo: Goto next question or outro
    const onNext = () => {
        ctx.setPanelContext({ panel: isLast ? PanelType.Outro : PanelType.Question, number: qNo + 1 })
    };

    // Helper to render the question type controllers
    const renderQuestionInput = () => {
        switch (question.type) {
            case 'multi':
            case 'checkbox':
                return (<MultiOrCheckboxQuestion key={question.id} question={question} setValidResponse={setValidResponse} />);

            case 'rank':
                return (<RankQuestion key={question.id} question={question} setValidResponse={setValidResponse} />);

            case 'scale':
                return (<ScaleQuestion key={question.id} question={question} setValidResponse={setValidResponse} />);

            case 'text':
            default:
                return (<div>Sorry, this question type is not yet supported.</div>);
        }
    };

    // Disable next button if a value is required and response is invalid
    const disableNext = !validResponse && question.required;

    return (
        <div className="flex flex-col h-full">
            <div className="p-2 flex-grow flex flex-col gap-2">
                <div className="text-lg font-bold relative">{question.title}{!question.required ? (<span className="text-sm font-thin ml-2 text-neutral-600 dark:text-neutral-400">(optional)</span>) : ''}</div>
                {question.description && (<div className="text-md line-clamp-4">{question.description}</div>)}
                <div className="mt-4">
                    {renderQuestionInput()}
                </div>
            </div>
            <div className="mt-2 w-full flex flex-col gap-2 justify-center items-center">
                <button disabled={disableNext} onClick={!disableNext ? onNext : undefined} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl ${disableNext ? 'cursor-not-allowed' : ' cursor-pointer'}`}>
                    {isLast ? 'Finish Survey' : 'Next Question'}
                </button>
                <div className="text-neutral-700 dark:text-neutral-300">Question {qNo+1} of {totalQs}</div>
            </div>
        </div>
    );
};
