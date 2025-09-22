/*!
* Survey listing page which lists all the user's surveys.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useCallback, useContext, useEffect, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { DashboardContext } from '../../DashboardContext';
import { SurveyListCard } from './SurveyListCard';
import { SurveyListCardLoading } from './SurveyListCardLoading';
import { SurveyDto } from '../../../../shared/redis/SurveyDto';
import { getSurveyList } from '../../../api/surveyDashboard';
import { navigateTo } from '@devvit/web/client';

export const SurveyList = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [surveyList, setSurveyList] = useState<SurveyDto[] | null>(null);
    const updateSurveyList = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const list = await getSurveyList();
            setSurveyList(list);
            setLoading(false);
            setError(false);
        } catch(e) {
            setSurveyList(null);
            setLoading(false);
            setError(true);
        }
    }, []);
    useEffect(() => {
        void updateSurveyList();
    }, [updateSurveyList]);

    return (
        <div>
            <div className="flex justify-between items-center border-b">
                <h1 className="text-md lg:text-2xl font-bold">Community Survey Dashboard</h1>
                <div className="my-4">
                    <button
                        className="border-2 border-lime-800 bg-lime-800 text-white px-2 py-1 rounded-lg text-small hover:bg-lime-700 hover:border-lime-700 flex gap-2 items-center cursor-pointer"
                        onClick={() => ctx.setPageContext({page: 'edit', surveyId: null})}
                    >
                        <PlusCircleIcon className="size-6" />
                        <div>New</div>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {loading && [<SurveyListCardLoading key="load1" />, <SurveyListCardLoading key="load2" />, <SurveyListCardLoading key="load3" />]}
                {!loading && !error && surveyList?.map(s => <SurveyListCard key={`card_${s.id}`} survey={s} updateSurveyList={updateSurveyList} />)}
                {!loading && !error && (!surveyList || surveyList.length <= 0) && (
                    <div className="col-span-1 md:col-span-2 flex justify-center">
                        <p className="border-1 px-4 py-2 bg-sky-100 dark:bg-sky-950 rounded-md border-sky-300 dark:border-sky-700">
                            You have not created any surveys yet. Start by <span className="underline cursor-pointer" onClick={() => ctx.setPageContext({page: 'edit', surveyId: null})}>creating a new survey</span>!
                        </p>
                    </div>
                )}
                {!loading && error && (
                    <div className="col-span-1 md:col-span-2 flex justify-center">
                        <p className="border-1 px-4 py-2 bg-red-100 dark:bg-red-950 rounded-md border-red-300 dark:border-red-700">
                            There was an error loading the survey list. Please try again later. Visit <span className="underline cursor-pointer" onClick={() => navigateTo("https://www.reddit.com/r/CommunitySurvey")}>r/CommunitySurvey</span> for Support.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
