/*!
* The intro to start a survey. This displays to a user if they have not started/responded to a
* survey yet.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { MouseEvent, useCallback, useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { formatRelativeDateTime } from '../../shared/dateFormat';
import {
    DocumentArrowDownIcon,
    PencilSquareIcon,
    PresentationChartBarIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { ResponseBlockedReason } from '../../../shared/types/postApi';
import { ResultVisibility } from '../../../shared/redis/SurveyDto';
import { renderMarkdown } from '../../shared/markdown/markdownFlavor';
import { requestExpandedMode } from '@devvit/web/client';

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
    const onStartSurvey = useCallback((e: MouseEvent) => {
        const startIndex = responses > 0 && responses < ctx.survey.questions.length
            ? responses
            : 0;
        if (!ctx.expandedMode) {
            requestExpandedMode(e.nativeEvent as PointerEvent, 'default');
            ctx.setExpandedMode(true);
        }
        ctx.setPanelContext({ panel: PanelType.Question, number: startIndex });
    }, [ctx, responses]);

    const showResults = useCallback((e: MouseEvent) => {
        if (!ctx.expandedMode) {
            requestExpandedMode(e.nativeEvent as PointerEvent, 'default');
            ctx.setExpandedMode(true);
        }
        ctx.setPanelContext({ panel: PanelType.Result, number: 0, prev: PanelType.Intro, showResultNav: true });
    }, [ctx]);

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
        <div className="flex flex-col gap-2 justify-between items-center h-full">
            <div className="w-full px-2 flex justify-between items-center text-neutral-content-weak border-b border-b-neutral-border">
                <div>
                    {ctx.canViewResults
                        ? (
                            <button onClick={showResults} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 group">
                                <div className="size-7 rounded-full flex justify-center items-center bg-upvote-background group-hover:bg-upvote-background-hovered">
                                    <PresentationChartBarIcon className="size-5 text-upvote-onbackground" />
                                </div>
                                <div><span className="text-upvote-plain">{ctx.survey.responseCount?.toLocaleString() ?? 0}</span> responses</div>
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
                <div className="p-2">
                    {ctx.survey.closeDate
                        ? (
                            <div className="flex gap-1 items-center">
                                <DocumentArrowDownIcon className="size-5" />
                                <span>{formatRelativeDateTime(ctx.survey.closeDate)}</span>
                            </div>
                        )
                        : 'No close date'}
                </div>
            </div>
            <div className="w-full p-2 pt-0 flex flex-col gap-2 justify-evenly items-center grow h-[0%]">
                <div className="flex flex-col gap-2 items-center">
                    <div className="text-2xl font-bold text-center leading-tight text-neutral-content-strong">{ctx.survey.title}</div>
                    {ctx.survey.intro && (
                        <div className={`text-center ${ctx.survey.intro.length > 300 || (ctx.survey.intro.match(/\n|\r\r/) || []).length > 6 ? 'text-sm line-clamp-8' : 'text-base line-clamp-6'}`}>
                            {renderMarkdown(ctx.survey.intro)}</div>
                    )}
                </div>
                <div className="w-full flex flex-col items-center gap-1">
                    <button
                        disabled={disableResponses}
                        onClick={!disableResponses ? onStartSurvey : undefined}
                        className={`w-2/3 max-w-75 flex justify-center items-center gap-1
                        font-bold text-survey-button-primary-onbackground
                        bg-survey-button-primary-background hover:bg-survey-button-primary-background-hovered
                        disabled:bg-secondary-background disabled:text-secondary-onbackground
                        p-2 rounded-xl ${disableResponses ? 'cursor-not-allowed' : ' cursor-pointer'}
                        `}
                    >
                        <PencilSquareIcon className="size-4" />
                        <div>
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
                        </div>
                    </button>
                    <div className="text-center text-sm text-neutral-content-weak">
                        {blockedReason?.[1] !== undefined
                            ? blockedReason[1]
                            : `${ctx.survey.questions.length} total questions`
                        }
                    </div>
                    {responses > 0 && (
                        <div className="mt-4 w-full flex justify-center">
                            <button onClick={onDelete} className="w-2/3 max-w-75 flex justify-center items-center gap-1 font-bold bg-danger-background text-danger-onbackground hover:bg-danger-background-hovered p-2 rounded-xl cursor-pointer">
                                <TrashIcon className="size-4" /> Delete Responses
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
