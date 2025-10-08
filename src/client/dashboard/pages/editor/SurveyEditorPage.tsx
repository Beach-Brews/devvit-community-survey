/*!
* Survey editor.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext, useEffect, useState } from 'react';
import { DashboardContext, DashboardSurveyIdPageContext } from '../../DashboardContext';
import { SurveyDto } from '../../../../shared/redis/SurveyDto';
import { getSurveyById } from '../../api/dashboardApi';
import { SurveyEditorLoading } from './SurveyEditorLoading';
import { navigateTo } from '@devvit/web/client';
import { SurveyEditor } from './SurveyEditor';
import { XMarkIcon } from '@heroicons/react/24/solid';

export const SurveyEditorPage = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const surveyId = (ctx.pageContext as DashboardSurveyIdPageContext).surveyId;
    const isNew = surveyId == null;

    const [loading, setLoading] = useState<boolean>(!isNew);
    const [surveyDto, setSurveyInfo] = useState<SurveyDto | null>(null);
    useEffect(() => {
        if (isNew) {
            setLoading(false);
            return;
        }

        (async () => {
            const apiResult = await getSurveyById(surveyId);
            if (apiResult)
                setSurveyInfo(apiResult);
            setLoading(false);
        })().catch(() => {
            setLoading(false);
        });
    }, [isNew, surveyId]);

    if (surveyDto || isNew)
        return <SurveyEditor survey={surveyDto} />;

    return (
        <>
            <div className="flex justify-between items-center border-b">
                <h1 className="text-md lg:text-2xl font-bold my-4">Survey Editor</h1>
                {!loading && (
                    <div className="my-4">
                        <button
                            className="border-2 bg-neutral-200 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 px-2 py-1 rounded-lg text-small hover:bg-neutral-300 hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:border-neutral-500 flex gap-2 items-center cursor-pointer"
                            onClick={() => ctx.setPageContext({page: 'list'})}
                        >
                            <XMarkIcon className="size-6" />
                            <div>Close</div>
                        </button>
                    </div>
                )}
            </div>
            <div className="my-4">
                {loading
                    ? (<SurveyEditorLoading />)
                    : (
                        <div className="col-span-1 md:col-span-2 flex justify-center">
                            <p className="border-1 px-4 py-2 bg-red-100 dark:bg-red-950 rounded-md border-red-300 dark:border-red-700">
                                There was an error loading the survey editor. Please try again later. Visit <span className="underline cursor-pointer" onClick={() => navigateTo("https://www.reddit.com/r/CommunitySurvey")}>r/CommunitySurvey</span> for Support.
                            </p>
                        </div>
                    )
                }
            </div>
        </>
    );
};
