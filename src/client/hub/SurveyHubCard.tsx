/*!
* A component representing a single survey card on the Hub.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ResultVisibility, SurveyDto } from '../../shared/redis/SurveyDto';
import {
    NoSymbolIcon,
    RssIcon,
    ChartBarSquareIcon,
} from '@heroicons/react/24/outline';
import { formatRelativeDateTime } from '../shared/dateFormat';
import { context, navigateTo } from '@devvit/web/client';
import { renderMarkdown } from '../shared/markdown/markdownFlavor';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';

export interface SurveyHubCardProps {
    survey: SurveyDto;
}

export const SurveyHubCard = (props: SurveyHubCardProps) => {
    const survey = props.survey;
    const {closeDate, resultVisibility, responseCount, title, intro} = survey;

    // Checking live state on re-render is expected here!
    // eslint-disable-next-line react-hooks/purity
    const live = !closeDate || closeDate > Date.now();

    const results = resultVisibility === ResultVisibility.Always
        ? (responseCount ?? 0).toLocaleString()
        : resultVisibility === ResultVisibility.Closed
            ? (live ? 'Once Closed' : (responseCount ?? 0).toLocaleString())
            : resultVisibility === ResultVisibility.Responders
                ? 'Responders'
                : 'Mods Only';

    const gotoPost = () => {
        if (survey.postId)
            navigateTo(`https://reddit.com/r/${context.subredditName}/comments/${survey.postId}`);
    };

    return (
        <div onClick={gotoPost} className="flex flex-col gap-2 px-2 py-1 cursor-pointer bg-neutral-background hover:bg-neutral-background-hovered rounded-md border border-neutral-border-weak">
            <div className="flex flex-nowrap text-nowrap gap-1 items-center text-sm">
                {live
                    ? (
                        <>
                            <div className="text-green-700 dark:text-green-300">LIVE</div>
                            <RssIcon className="size-3 text-green-700 dark:text-green-300" />
                        </>
                    )
                    : (
                        <>
                            <div className="text-danger-plain">CLOSED</div>
                            <NoSymbolIcon className="size-3 text-danger-plain" />
                        </>
                    )
                }
                <div>&bull;</div>
                <ChartBarSquareIcon className="size-3" />
                <div>{results}</div>
                <div>&bull;</div>
                <CalendarDaysIcon className="size-3" />
                <div>{closeDate ? formatRelativeDateTime(closeDate) : 'No close date'}</div>
            </div>
            <div className={`text-base font-semibold text-neutral-content-strong ${live ? "" : "line-clamp-1"}`}>{title}</div>
            <div className={live ? "line-clamp-2" : "line-clamp-1"}>{renderMarkdown(intro, true)}</div>
        </div>
    );
};
