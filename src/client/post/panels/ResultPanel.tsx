/*!
* A panel to display results to a user.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext, useEffect, useState } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { ErrorPanel } from './ErrorPanel';
import { SurveyQuestionDto } from '../../../shared/redis/SurveyDto';
import { QuestionResponseDto } from '../../../shared/redis/ResponseDto';
import { getResultsForQuestion } from '../api/surveyApi';
import { MultiOptionResult } from './results/MultiOptionResult';
import { ScaleResult } from './results/ScaleResult';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';

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
            <div className="mb-4 flex gap-2 justify-between items-center">
                <button onClick={onClose} className="svy-btn-secondary">
                    <XMarkIcon className="size-5" />
                    <span>Close</span>
                </button>
            </div>
            {question?.title &&
                (<div className="text-xl font-bold text-neutral-content-strong">{question.title}</div>)
            }
            <div className="relative grow h-[0%] w-full p-2 border border-neutral-border rounded-xl">
                <div className="h-full overflow-hidden">
                    {question && result
                        ? renderResults(question, result)
                        : loading
                            ? (<div className="p-4 flex flex-col justify-center items-center gap-2"><LoadingSpinner className="bg-neutral-content-weak" /> <span>Loading results...</span></div>)
                            : (<ErrorPanel />)
                    }
                </div>
            </div>
            {ctx.panelContext.showResultNav === true && (
                <div className="flex justify-between flex-wrap gap-x-2 gap-y-4">
                    <div className="flex items-center gap-2 order-2 xs:order-1">
                        <button onClick={loading || qNo == 0 ? undefined : onPrevNav} disabled={loading || qNo == 0} className="svy-btn-secondary">
                            <ArrowLeftIcon className="size-5" />
                            <span>Previous</span>
                        </button>
                    </div>
                    <div className="flex-1 order-1 xs:order-2 basis-full xs:basis-0 flex flex-col gap-1 justify-center items-center text-sm">
                        <div>Question {(qNo ?? 0)+1} of {totalQs}</div>
                        <div className="relative w-full max-w-50 h-1.5 rounded-full bg-neutral-border-weak">
                            <div className="absolute inset-0 h-full rounded-full bg-survey-button-primary-background" style={{width: Math.floor(((qNo??0)+1)/(totalQs+1)*100) + '%'}}></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 order-3">
                        <button onClick={loading || isLast ? undefined : onNextNav} disabled={loading || isLast} className="svy-btn-secondary">
                            <span>Next</span>
                            <ArrowRightIcon className="size-5" />
                        </button>
                    </div>
                </div>
            )}
            <div className="mt-4 flex gap-2 justify-between items-center">
                <button onClick={onClose} className="svy-btn-secondary">
                    <XMarkIcon className="size-5" />
                    <span>Close</span>
                </button>
            </div>
      </div>
    );
};
