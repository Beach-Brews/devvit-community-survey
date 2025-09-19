/*!
* Survey editor.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext, useEffect, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { DashboardContext, DashboardSurveyIdPageContext } from '../../DashboardContext';
import { SurveyDto } from '../../../../shared/redis/SurveyDto';
import { getSurveyById } from '../../../api/surveyDashboard';

export const SurveyEditor = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const surveyId = (ctx.pageContext as DashboardSurveyIdPageContext).surveyId;
    const isNew = surveyId == null;

    const [loading, setLoading] = useState<boolean>(!isNew);
    const [surveyInfo, setSurveyInfo] = useState<SurveyDto | null>(null);
    useEffect(() => {
        if (isNew) {
            setLoading(false);
            return;
        }

        (async () => {
            const surveyDto = await getSurveyById(surveyId);
            if (surveyDto)
                setSurveyInfo(surveyDto);
            setLoading(false);
        })().catch(() => {
            setLoading(false);
        });
    }, [isNew, surveyId]);

    return (
        <div>
            <div className="flex justify-between items-center border-b">
                <h1 className="text-md lg:text-2xl font-bold">Survey Editor</h1>
                <div className="my-4">
                    <button
                        className="border-2 border-lime-800 bg-lime-800 text-white px-2 py-1 rounded-lg text-small hover:bg-lime-700 hover:border-lime-700 flex gap-2 items-center cursor-pointer"
                        onClick={() => ctx.setPageContext({page: 'list'})}
                    >
                        <PlusCircleIcon className="size-6" />
                        <div>New</div>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {surveyInfo
                    ? <div>Edit existing survey {surveyInfo.title}</div>
                    : isNew
                        ? <div>Create new survey</div>
                        : loading
                            ? <div>Loading...</div>
                            : <div>ERROR NOT FOUND</div>
                }
            </div>
        </div>
    );
};
