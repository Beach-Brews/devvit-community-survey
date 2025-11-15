/*!
* The intro to start a survey. This displays to a user if they have not started/responded to a
* survey yet.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { formatRelativeDateTime } from '../../shared/dateFormat';
import { DocumentArrowDownIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';

export interface IntroPanelProps {
    isAnonymous: boolean
}

export const IntroPanel = (props: IntroPanelProps) => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    // Handler for starting survey
    const responses = ctx.lastResponse ? Object.keys(ctx.lastResponse).length : 0;
    const onStartSurvey = () => {
        const startIndex = responses > 0 && responses < ctx.survey.questions.length
            ? responses
            : 0;
        ctx.setPanelContext({ panel: PanelType.Question, number: startIndex });
    };

    const showResults = () => {
        ctx.setPanelContext({ panel: PanelType.Result, number: 0, prev: PanelType.Intro, showResultNav: true });
    };

    const onDelete = () => {
        ctx.setPanelContext({ panel: PanelType.Delete, prev: PanelType.Intro });
    };

    return (
        <div className="flex flex-col gap-4 justify-between items-center h-full">
            <div className="w-full flex justify-between">
                <div className="text-neutral-700 dark:text-neutral-300">
                    <button onClick={showResults} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200">
                        <PresentationChartBarIcon className="size-5" />
                        <span>{ctx.survey.responseCount?.toLocaleString() ?? 0}</span>
                    </button>
                </div>
                <div className="p-2 text-neutral-700 dark:text-neutral-300">
                    {ctx.survey.closeDate
                        ? (<div className="flex gap-1 items-center"><DocumentArrowDownIcon className="size-5" /><span>{formatRelativeDateTime(ctx.survey.closeDate)}</span></div>)
                        : 'No close date'}
                </div>
            </div>
            <div className="flex flex-col gap-4 justify-center items-center flex-grow h-[0%]">
                <div className="text-4xl font-bold text-center">{ctx.survey.title}</div>
                {ctx.survey.intro && (<div className="text-xl text-center line-clamp-5">{ctx.survey.intro}</div>)}
                <div className="mt-8 w-full flex justify-center">
                    <button disabled={props.isAnonymous} onClick={!props.isAnonymous ? onStartSurvey : undefined} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl ${props.isAnonymous ? 'cursor-not-allowed' : ' cursor-pointer'}`}>
                        {props.isAnonymous
                            ? 'Login to Take Survey'
                            : responses <= 0
                                ? 'Start Survey'
                                : responses < ctx.survey.questions.length
                                    ? 'Continue Survey'
                                    : 'Change Responses'
                        }
                    </button>
                </div>
                <div className="text-neutral-700 dark:text-neutral-300">{ctx.survey.questions.length} total questions</div>
                {responses > 0 && (
                    <div className="mt-8 w-full flex justify-center">
                        <button onClick={onDelete} className="w-2/3 max-w-[300px] text-white bg-red-800 dark:bg-red-900 px-8 py-2 rounded-xl cursor-pointer">
                            Delete Response
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
