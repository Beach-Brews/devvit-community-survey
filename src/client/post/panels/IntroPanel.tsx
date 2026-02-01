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
import { ResponseBlockedReason } from '../../../shared/types/postApi';
import { ResultVisibility } from '../../../shared/redis/SurveyDto';

export interface IntroPanelProps {
    isAnonymous: boolean,
    responseBlocked: ResponseBlockedReason | null | undefined
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

    const disableResponses = !!props.responseBlocked || props.isAnonymous;

    const blockedReason = (() => {
        if (!props.responseBlocked) return undefined;
        switch (props.responseBlocked) {
            case ResponseBlockedReason.BANNED:
                return ['Account Is Banned', 'Sorry, banned users cannot respond to this survey.'];
            case ResponseBlockedReason.MUTED:
                return ['Account Is Muted', 'Sorry, muted users cannot respond to this survey.'];
            case ResponseBlockedReason.NOT_VERIFIED:
                return ['Email Unverified', 'Sorry, users must have a verified email on their account to respond to this survey.'];
            case ResponseBlockedReason.NOT_APPROVED:
                return ['Not an Approved User', 'Sorry, users must be an approved user of this subreddit to respond to this survey.'];
            case ResponseBlockedReason.MIN_AGE:
                return ['Account Too New', `Sorry, users with accounts newer than ${ctx.survey.responderCriteria?.minAge ?? 0} days cannot respond to this survey.`];
            case ResponseBlockedReason.MIN_POST_KARMA:
                return ['Account Post Karma Too Low', `Sorry, users must have a minimum of ${ctx.survey.responderCriteria?.minKarma?.value?.toLocaleString() ?? 0} account Post Karma to respond to this survey.`];
            case ResponseBlockedReason.MIN_COMMENT_KARMA:
                return ['Account Comment Karma Too Low', `Sorry, users must have a minimum of ${ctx.survey.responderCriteria?.minKarma?.value?.toLocaleString() ?? 0} account Comment Karma to respond to this survey.`];
            case ResponseBlockedReason.MIN_KARMA:
                return ['Account Karma Too Low', `Sorry, users must have a minimum of ${ctx.survey.responderCriteria?.minKarma?.value?.toLocaleString() ?? 0} account Karma to respond to this survey.`];
            case ResponseBlockedReason.MIN_SUB_POST_KARMA:
                return ['Subreddit Post Karma Too Low', `Sorry, users must have a minimum of ${ctx.survey.responderCriteria?.minSubKarma?.value?.toLocaleString() ?? 0} community Post Karma to respond to this survey.`];
            case ResponseBlockedReason.MIN_SUB_COMMENT_KARMA:
                return ['Subreddit Comment Karma Too Low', `Sorry, users must have a minimum of ${ctx.survey.responderCriteria?.minSubKarma?.value?.toLocaleString() ?? 0} community Comment Karma to respond to this survey.`];
            case ResponseBlockedReason.MIN_SUB_KARMA:
                return ['Subreddit Karma Too Low', `Sorry, users must have a minimum of ${ctx.survey.responderCriteria?.minSubKarma?.value?.toLocaleString() ?? 0} community Karma to respond to this survey.`];
            case ResponseBlockedReason.USER_FLAIR:
                return ['User Flair Restricted', 'Sorry, users must have a specific user flair to respond to this survey.'];
            default:
                return ['Error', 'An unknown error has occurred. Try again later.'];
        }
    })();

    return (
        <div className="flex flex-col gap-4 justify-between items-center h-full">
            <div className="w-full flex justify-between">
                <div className="text-neutral-700 dark:text-neutral-300">
                    {ctx.canViewResults
                        ? (
                            <button onClick={showResults} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200">
                                <PresentationChartBarIcon className="size-5" />
                                <span>{ctx.survey.responseCount?.toLocaleString() ?? 0}</span>
                            </button>
                        )
                        : (
                            <div className="flex gap-1 items-center rounded-lg p-2">
                                <PresentationChartBarIcon className="size-5" />
                                <span>{ctx.survey.resultVisibility === ResultVisibility.Closed
                                    ? 'Results Once Closed'
                                    : ctx.survey.resultVisibility === ResultVisibility.Responders
                                        ? 'Results Once Complete'
                                        : 'Mods Only'
                                }</span>
                            </div>
                        )
                    }
                </div>
                <div className="p-2 text-neutral-700 dark:text-neutral-300">
                    {ctx.survey.closeDate
                        ? (<div className="flex gap-1 items-center"><DocumentArrowDownIcon className="size-5" /><span>{formatRelativeDateTime(ctx.survey.closeDate)}</span></div>)
                        : 'No close date'}
                </div>
            </div>
            <div className="w-full flex flex-col gap-4 justify-center items-center flex-grow h-[0%]">
                <div className="text-2xl font-bold text-center">{ctx.survey.title}</div>
                {ctx.survey.intro && (<div className="text-base text-center line-clamp-6">{ctx.survey.intro}</div>)}
                <div className="w-full flex justify-center">
                    <button disabled={disableResponses} onClick={!disableResponses ? onStartSurvey : undefined} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl ${disableResponses ? 'cursor-not-allowed' : ' cursor-pointer'}`}>
                        {props.isAnonymous
                            ? 'Login to Start Survey'
                            : blockedReason?.[0] !== undefined
                                ? blockedReason[0]
                                : responses <= 0
                                    ? 'Start Survey'
                                    : responses < ctx.survey.questions.length
                                        ? 'Continue Survey'
                                        : 'Change Responses'
                        }
                    </button>
                </div>
                {blockedReason?.[1] !== undefined
                    ? (<div className="text-neutral-700 dark:text-neutral-300 text-center">{blockedReason[1]}</div>)
                    : (<div className="text-neutral-700 dark:text-neutral-300 text-center">{ctx.survey.questions.length} total questions</div>)}
                {responses > 0 && (
                    <div className="w-full flex justify-center">
                        <button onClick={onDelete} className="w-2/3 max-w-[300px] text-white bg-red-800 dark:bg-red-900 px-8 py-2 rounded-xl cursor-pointer">
                            Delete Responses
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
