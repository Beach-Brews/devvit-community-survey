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
import { formatDateTime } from '../../../shared/dateFormat';
import { SurveyDeleteConfirmModal } from './SurveyDeleteConfirmModal';

export interface SurveyListCardProps {
    survey: SurveyDto;
    updateSurveyList: () => Promise<void>;
}

export const SurveyListCard = (props: SurveyListCardProps) => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const { survey } = props;

    const now = Date.now();
    const isDeleted = survey.deleteQueued === true;
    const isClosed = survey.closeDate && survey.closeDate < now;
    const isPublished = survey.publishDate && survey.publishDate <= now;
    const isScheduled = survey.publishDate && survey.publishDate > now;

    const status = isDeleted
        ? (<div className="flex items-center px-1 gap-1 text-rose-700 dark:text-rose-300">delete queued <TrashIcon className="size-3" /></div>)
        : isClosed
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
        <div className="text-sm p-2 flex flex-col justify-between gap-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white dark:bg-neutral-900 border-1 border-neutral-300 dark:border-neutral-700">
            <div className="flex justify-between items-center">
                <div className="px-1 text-[0.70rem] uppercase font-bold">{status}</div>
                <div className="flex gap-1">
                    {!isPublished && !isDeleted && (<div className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200" onClick={editSurvey}><PencilSquareIcon className="size-5" /></div>)}
                    {(!isPublished || isClosed) && !isDeleted && (<div className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200" onClick={deleteSurvey}><TrashIcon className="size-5" /></div>)}
                    {isPublished && !isClosed && !isDeleted && (<div className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200" onClick={closeSurvey}><StopCircleIcon className="size-5" /></div>)}
                </div>
            </div>
            <div className={`px-1 text-2xl text-neutral-900 dark:text-neutral-100${isDeleted ? ' opacity-30 line-through' : ''}`}>{survey.title}</div>
            <div className="flex justify-between items-center min-h-6">
                {(!isDeleted && isPublished
                    ? <div className="w-1/3 flex gap-2 items-center cursor-pointer rounded-lg px-1 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200" onClick={viewSurveyResults}><PresentationChartBarIcon className="size-5" /><span>{survey.responseCount?.toLocaleString()}</span></div>
                    : <div className="w-1/3"></div>
                )}
                {ctx.userInfo.allowDev && (<div className="w-1/3 text-center px-1 text-[0.7rem] text-neutral-600 dark:text-neutral-400">{survey.id}</div>)}
                {!isDeleted && !isScheduled && !isPublished && (<div className="w-1/3 flex justify-end items-center px-1">Not Scheduled</div>)}
                {!isDeleted && isScheduled && !isPublished && (<div className="w-1/3 flex justify-end items-center px-1"><div className="p-0.5 rounded-lg"><DocumentArrowUpIcon className="size-5" /></div> {formatDateTime(survey.publishDate)}</div>)}
                {!isDeleted && isPublished && survey.closeDate && (<div className="w-1/3 flex justify-end items-center px-1"><div className="p-0.5 rounded-lg"><DocumentArrowDownIcon className="size-5" /></div> {formatDateTime(survey.closeDate)}</div>)}
                {!isDeleted && isPublished && !survey.closeDate && (<div className="w-1/3 flex justify-end items-center px-1">No Close Date</div>)}
                {isDeleted && (<div className="w-1/3 flex justify-end items-center px-1"></div>)}
            </div>
        </div>
    );
};
