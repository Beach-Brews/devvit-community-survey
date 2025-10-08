/*!
* Survey results.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { DashboardContext, DashboardSurveyIdPageContext } from '../../DashboardContext';
import { SurveyDto } from '../../../../shared/redis/SurveyDto';
import { getSurveyById } from '../../api/dashboardApi';
import { navigateTo } from '@devvit/web/client';

export const SurveyResultsPage = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const surveyId = (ctx.pageContext as DashboardSurveyIdPageContext).surveyId;

    const [loading, setLoading] = useState<boolean>(true);
    const [surveyInfo, setSurveyInfo] = useState<SurveyDto | null>(null);
    useEffect(() => {
        if (surveyId == null) return;
        (async () => {
            const surveyDto = await getSurveyById(surveyId);
            if (surveyDto)
                setSurveyInfo(surveyDto);
            setLoading(false);
        })().catch(() => {
            setLoading(false);
        });
    }, [surveyId]);

    if (surveyId == null) {
        return (
            <div className="col-span-1 md:col-span-2 flex justify-center">
                <p className="border-1 px-4 py-2 bg-red-100 dark:bg-red-950 rounded-md border-red-300 dark:border-red-700">
                    There was an error loading the survey editor. Please try again later. Visit <span className="underline cursor-pointer" onClick={() => navigateTo("https://www.reddit.com/r/CommunitySurvey")}>r/CommunitySurvey</span> for Support.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center border-b">
                <h1 className="text-md lg:text-2xl font-bold">Survey Editor</h1>
                <div className="my-4">
                    <button
                        className="border-2 bg-neutral-200 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 px-2 py-1 rounded-lg text-small hover:bg-neutral-300 hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:border-neutral-500 flex gap-2 items-center cursor-pointer"
                        onClick={() => ctx.setPageContext({page: 'list'})}
                    >
                        <XMarkIcon className="size-6" />
                        <div>Close</div>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {surveyInfo
                    ? <div>Viewing results of survey {surveyInfo.title}</div>
                    : loading
                        ? <div>Loading...</div>
                        : <div>ERROR NOT FOUND</div>
                }
            </div>
        </div>
    );
};
