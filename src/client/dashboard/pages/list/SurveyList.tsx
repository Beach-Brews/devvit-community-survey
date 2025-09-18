/*!
* Survey listing page which lists all the user's surveys.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext, useEffect, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { DashboardContext } from '../../DashboardContext';
import { SurveyListCard } from './SurveyListCard';
import { SurveyListCardLoading } from './SurveyListCardLoading';
import { SurveyDto } from '../../../../shared/redis/SurveyDto';
import { getSurveyList } from '../../../api/surveyList';

export const SurveyList = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const [loading, setLoading] = useState<boolean>(true);
    const [surveyList, setSurveyList] = useState<SurveyDto[] | null>(null);
    useEffect(() => {
        (async () => {
            const list = await getSurveyList();
            setSurveyList(list);
            setLoading(false);
        })().catch(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center border-b">
                <h1 className="text-md lg:text-2xl font-bold">Community Survey Dashboard</h1>
                <div className="my-4">
                    <button
                        className="border-2 border-lime-800 bg-lime-800 text-white px-2 py-1 rounded-lg text-small hover:bg-lime-700 hover:border-lime-700 flex gap-2 items-center cursor-pointer"
                        onClick={() => ctx.setPageContext({page: 'edit', surveyId: -1})}
                    >
                        <PlusCircleIcon className="size-6" />
                        <div>New</div>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                {loading && [<SurveyListCardLoading />, <SurveyListCardLoading />, <SurveyListCardLoading />]}
                {!loading && surveyList?.map(s => <SurveyListCard survey={s} />)}
                {!loading && (!surveyList || surveyList.length <= 0) && (
                    <div className="col-span-1 md:col-span-2 flex justify-center">You have not created any surveys yet. </div>
                )}
            </div>
        </div>
    );
};
