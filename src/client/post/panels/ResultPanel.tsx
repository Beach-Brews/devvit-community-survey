/*!
* A panel to display results to a user.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext, useEffect, useState } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { ArrowUturnLeftIcon, ForwardIcon, BackwardIcon } from '@heroicons/react/24/solid';
import { ErrorPanel } from './ErrorPanel';
import { SurveyQuestionDto } from '../../../shared/redis/SurveyDto';
import { QuestionResponseDto } from '../../../shared/redis/ResponseDto';
import { getResultsForQuestion } from '../api/surveyApi';
import { MultiOptionResult } from './results/MultiOptionResult';
import { ScaleResult } from './results/ScaleResult';

const ResultLoading = () => {
    return (
        <div className="w-full p-2 grid grid-cols-[auto_1fr] items-center gap-2">
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[110px] justify-self-end"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[25%]"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[85px] justify-self-end"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[65%]"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[65px] justify-self-end"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[33%]"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[85px] justify-self-end"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[10%]"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[110px] justify-self-end"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[60%]"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[50px] mt-4 justify-self-end"></div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-[25%] mt-4"></div>
        </div>
    );
}

export const ResultPanel = () => {

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

    // Save state for fetched result
    const [result, setResult] = useState<QuestionResponseDto | null | undefined>(undefined);
    const loading = question !== undefined && result === undefined;

    // Fetch result
    const questionId = question?.id;
    useEffect(() => {
        if (!questionId) return;
        const callApi = async () => {
            try {
                const response = await getResultsForQuestion(questionId);
                setResult(response);
            } catch (error) {
                console.error('[Survey Post] Failed to load question result: ', error);
                setResult(null);
            }
        };
        void callApi();
    }, [questionId]);

    // Close results and go to previous screen
    const onClose = () => {
        const current = ctx.panelContext;
        ctx.setPanelContext({ ...current, panel: current.prev ?? PanelType.Intro, prev: PanelType.Result });
    };

    // Go to previous result
    const onPrevNav = () => {
        const current = ctx.panelContext;
        setResult(undefined);
        ctx.setPanelContext({ ...current, number: qNo !== undefined ? (qNo - 1) : 0 });
    };

    // Go to next result
    const onNextNav = () => {
        const current = ctx.panelContext;
        setResult(undefined);
        ctx.setPanelContext({ ...current, number: qNo !== undefined ? (qNo + 1) : 0 });
    };
    
    const renderResults = (question: SurveyQuestionDto, response: QuestionResponseDto) => {
        switch (question.type) {
            case 'multi':
            case 'checkbox':
            case 'rank':
                return <MultiOptionResult question={question} response={response} />;

            case 'scale':
                return <ScaleResult question={question} response={response} />;

            default:
                return (<div>{question.type} not supported</div>);
        }
    };

    return (
        <div className="flex flex-col gap-2 h-full">
            <div className="flex gap-2 justify-between items-center">
                <button onClick={onClose} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200">
                    <ArrowUturnLeftIcon className="size-5" />
                    <span>Close</span>
                </button>
            </div>
            {question?.title
                ? (<div>{question.title}</div>)
                : (<div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-2/3"></div>)
            }
            <div className="flex-grow h-[0%] overflow-hidden w-full p-2 border border-neutral-500 rounded-md">
                {question && result
                    ? renderResults(question, result)
                    : loading
                        ? (<ResultLoading />)
                        : (<ErrorPanel />)
                }
            </div>
            {ctx.panelContext.showResultNav === true && (
                <div className="flex justify-between items-center">
                    <div className={loading || qNo == 0 ? 'opacity-25 pointer-events-none' : ''}>
                        <button onClick={loading || qNo == 0 ? undefined : onPrevNav} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200">
                            <BackwardIcon className="size-5" />
                            <span>Previous</span>
                        </button>
                    </div>
                    <div className={loading || isLast ? 'opacity-25 pointer-events-none' : ''}>
                        <button onClick={loading || isLast ? undefined : onNextNav} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200">
                            <ForwardIcon className="size-5" />
                            <span>Next</span>
                        </button>
                    </div>
                </div>
            )}
      </div>
    );
};
