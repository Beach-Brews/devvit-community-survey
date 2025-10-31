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
    const [response, setResponse] = useState<string[] | undefined>(question?.type === 'rank'
        ? question.options.map(o => o.value)
        : undefined);

    // If question is undefined, return error screen
    if (qNo === undefined || !question) {
        return (<ErrorPanel />);
    }

    // Helper to determine if response is valid
    const validResponse = !question.required || (!!response && response.length > 0);

    // Move to next panel if not saving and response is valid
    const onNext = async () => {
        if (!validResponse) return;
        // TODO: Handle error state
        // Only save response if a response was provided
        if (response)
            await fetch('/api/post/survey/' + question.id, { method: 'POST', body: JSON.stringify(response) });
        ctx.setPanelContext({ panel: isLast ? PanelType.Outro : PanelType.Question, number: qNo + 1 })
    };

    // Helper to render the question type controllers
    const renderQuestionInput = () => {
        switch (question.type) {
            case 'multi':
            case 'checkbox':
                return (<MultiOrCheckboxQuestion key={question.id} question={question} response={response} setResponse={setResponse} />);

            case 'rank':
                return (<RankQuestion key={question.id} question={question} response={response} setResponse={setResponse}  />);

            case 'scale':
                return (<ScaleQuestion key={question.id} question={question} response={response} setResponse={setResponse} />);

            case 'text':
            default:
                return (<div>Sorry, this question type is not yet supported.</div>);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow flex flex-col gap-2">
                <div className="text-base md:text-lg font-bold relative">{question.title}{!question.required ? (<span className="text-sm font-thin ml-2 text-neutral-600 dark:text-neutral-400">(optional)</span>) : ''}</div>
                {question.description && (<div className="text-sm md:text-base line-clamp-4">{question.description}</div>)}
                <div className={`flex ${question.type === 'scale' ? ' justify-center' : 'justify-start'} items-center w-full`}>
                    {renderQuestionInput()}
                </div>
            </div>
            <div className="mt-2 w-full flex flex-col gap-2 justify-center items-center">
                <button disabled={!validResponse} onClick={validResponse ? onNext : undefined} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl ${!validResponse ? 'cursor-not-allowed' : ' cursor-pointer'}`}>
                    {isLast ? 'Finish Survey' : 'Next Question'}
                </button>
                <div className="text-neutral-700 dark:text-neutral-300">Question {qNo+1} of {totalQs}</div>
            </div>
        </div>
    );
};
