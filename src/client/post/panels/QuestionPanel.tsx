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
import { ArrowLeftIcon, ArrowRightIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';
import { upsertResponse } from '../api/surveyApi';
import { ToastType } from '../../shared/toast/toastTypes';
import { renderMarkdown } from '../../shared/markdown/markdownFlavor';

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
    const [response, setResponse] = useState<string[] | undefined>(question
        ? ctx.lastResponse?.[question.id]
            ?? (question?.type === 'rank' ? question.options.map(o => o.value) : undefined)
        : undefined);

    // If question is undefined, return error screen
    if (qNo === undefined || !question) {
        return (<ErrorPanel />);
    }

    // Helper to determine if response is valid
    const validResponse = !question.required || (!!response && response.length > 0);

    // Move to next panel if not saving and response is valid
    const onNext = async () => {
        try {
            if (!validResponse) return;

            // Only save response if a response was provided
            if (response) {
                await upsertResponse(question.id, response);

                // Update context response
                ctx.setLastResponse({
                    ...(ctx.lastResponse ?? {}),
                    [question.id]: response,
                });
            }

            ctx.setPanelContext({ panel: isLast ? PanelType.Outro : PanelType.Question, number: qNo + 1 });
        } catch (e) {
            ctx.addToast({
                message: 'Error saving response.',
                type: ToastType.Error
            });
        }
    };

    const onPrevious = () => {
        ctx.setPanelContext({ panel: PanelType.Question, number: qNo - 1 });
    };

    const showResults = () => {
        ctx.setPanelContext({ panel: PanelType.Result, number: qNo, prev: PanelType.Question, showResultNav: false });
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
        <div className="h-full flex flex-col gap-4">
            <div className="text-xl font-bold text-neutral-content-strong">
                {question.title}
                {!question.required ? (<span className="text-sm font-thin ml-2 text-neutral-content-weak">(optional)</span>) : ''}
            </div>
            <div>{renderMarkdown(question.description)}</div>
            <div className="flex flex-col gap-2 w-full">
                {renderQuestionInput()}
            </div>
            <div className="flex justify-between flex-wrap gap-x-2 gap-y-4">
                <div className="flex items-center gap-2 order-2 xs:order-1">
                    <button onClick={onPrevious} disabled={qNo <= 0} className="svy-btn-secondary">
                        <ArrowLeftIcon className="size-5" />
                        <span>Previous</span>
                    </button>
                    {ctx.canViewResults && (
                        <button onClick={showResults} className="svy-btn-secondary">
                            <PresentationChartBarIcon className="size-5" />
                            <span>Results</span>
                        </button>
                    )}
                </div>
                <div className="flex-1 order-1 xs:order-2 basis-full xs:basis-0 flex flex-col gap-1 justify-center items-center text-sm">
                    <div>Question {qNo+1} of {totalQs}</div>
                    <div className="relative w-full max-w-50 h-1.5 rounded-full bg-neutral-border-weak">
                        <div className="absolute inset-0 h-full rounded-full bg-survey-button-primary-background" style={{width: Math.floor((qNo+1)/(totalQs+1)*100) + '%'}}></div>
                    </div>
                </div>
                <div className="flex items-center gap-2 order-3">
                    <button disabled={!validResponse} onClick={validResponse ? onNext : undefined} className="svy-btn-primary">
                        {isLast ? 'Finish' : 'Next'}
                        <ArrowRightIcon className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
