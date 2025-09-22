/*!
* Represents a single survey on the survey list.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { DocumentArrowDownIcon, DocumentArrowUpIcon, PencilSquareIcon, PresentationChartBarIcon, StopCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CalendarIcon, NoSymbolIcon, PencilIcon, RssIcon } from '@heroicons/react/24/solid';
import { DashboardContext } from '../../DashboardContext';
import { SurveyDto } from '../../../../shared/redis/SurveyDto';
import { formatDateTime } from '../../shared/dateFormat';
import { SurveyDeleteConfirmModal } from './SurveyDeleteConfirmModal';

export interface SurveyListCardProps {
    survey: SurveyDto;
    updateSurveyList: () => Promise<void>;
}

export const SurveyListCard = (props: SurveyListCardProps) => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const { survey } = props;

    const now = new Date().getTime();
    const isClosed = survey.closeDate && survey.closeDate < now;
    const isPublished = survey.publishDate && survey.publishDate <= now;
    const isScheduled = survey.publishDate && survey.publishDate > now;

    const status = isClosed
        ? (<div className="flex items-center px-1 gap-1 text-rose-700 dark:text-rose-300">closed <NoSymbolIcon className="size-3" /></div>)
        : isPublished
            ? (<div className="flex items-center px-1 gap-1 text-green-700 dark:text-green-300">live <RssIcon className="size-3" /></div>)
            : isScheduled
                ? (<div className="flex items-center px-1 gap-1 text-blue-700 dark:text-blue-300">scheduled <CalendarIcon className="size-3" /></div>)
                : (<div className="flex items-center px-1 gap-1 text-neutral-700 dark:text-neutral-300">draft <PencilIcon className="size-3" /></div>);

    const editSurvey = () => {
        ctx.setPageContext({page: 'edit', surveyId: survey.id});
    };
    const deleteSurvey = () => {
        ctx.setModal(<SurveyDeleteConfirmModal action={'delete'} survey={survey} updateSurveyList={props.updateSurveyList} />);
    };
    const closeSurvey = () => {
        ctx.setModal(<SurveyDeleteConfirmModal action={'close'} survey={survey} updateSurveyList={props.updateSurveyList} />);
    };
    const viewSurveyResults = () => {
        ctx.setPageContext({page: 'results', surveyId: survey.id});
    };

    return (
        <div className="text-sm p-2 flex flex-col justify-between gap-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white shadow-md dark:bg-neutral-900 dark:shadow-neutral-800">
            <div className="flex justify-between items-center">
                <div className="px-1 text-[0.70rem] uppercase font-bold">{status}</div>
                <div className="flex gap-1">
                    {!isPublished && (<div className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200" onClick={editSurvey}><PencilSquareIcon className="size-5" /></div>)}
                    {(!isPublished || isClosed) && (<div className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200" onClick={deleteSurvey}><TrashIcon className="size-5" /></div>)}
                    {isPublished && !isClosed && (<div className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200" onClick={closeSurvey}><StopCircleIcon className="size-5" /></div>)}
                </div>
            </div>
            <div className="px-1 text-2xl text-neutral-900 dark:text-neutral-100">{survey.title}</div>
            <div className="flex justify-between items-center min-h-6">
                {(isPublished
                    ? <div className="flex items-center cursor-pointer rounded-lg px-1 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200" onClick={viewSurveyResults}><PresentationChartBarIcon className="size-5" /> 1,462</div>
                    : <div></div>
                )}
                {!isScheduled && !isPublished && (<div className="flex items-center px-1">Not Scheduled</div>)}
                {isScheduled && !isPublished && (<div className="flex items-center px-1"><div className="p-0.5 rounded-lg"><DocumentArrowUpIcon className="size-5" /></div> {formatDateTime(survey.publishDate)}</div>)}
                {isPublished && survey.closeDate && (<div className="flex items-center px-1"><div className="p-0.5 rounded-lg"><DocumentArrowDownIcon className="size-5" /></div> {formatDateTime(survey.closeDate)}</div>)}
                {isPublished && !survey.closeDate && (<div className="flex items-center px-1">No Close Date</div>)}
            </div>
        </div>
    );
};
