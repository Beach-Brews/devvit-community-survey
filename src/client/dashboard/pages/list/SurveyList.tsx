/*!
* Survey listing page which lists all the user's surveys.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { PencilSquareIcon, PlusCircleIcon, PresentationChartBarIcon, TrashIcon } from '@heroicons/react/24/solid';
import { DashboardContext } from '../../DashboardContext';

const SurveyListCard = () => {
    return (
        <div className="p-2 flex flex-col gap-4 text-neutral-700 dark:text-neutral-300 border-1 border-neutral-600 dark:border-neutral-400 rounded-md bg-neutral-200 dark:bg-neutral-800">
            <div className="flex justify-between items-center">
                <div className="uppercase font-bold">Draft</div>
                <div className="flex gap-1">
                    <div className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200"><PencilSquareIcon className="size-6" /></div>
                    <div className="p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200"><TrashIcon className="size-6" /></div>
                </div>
            </div>
            <div className="text-2xl text-neutral-900 dark:text-neutral-100">Proposed Rule Changes for 2025 Season</div>
            <div className="flex justify-between items-center">
                <div className="flex"><div className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200"><PresentationChartBarIcon className="size-6" /></div> 1,462</div>
                <div>09/19/2025 8:00 AM</div>
            </div>
        </div>
    );
};

export const SurveyList = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');
    return (
        <div>
            <div className="flex justify-between items-center border-b mb-4">
                <h1 className="text-md lg:text-2xl font-bold">Community Survey Dashboard</h1>
                <div className="my-4">
                    <button
                        className="border-2 border-lime-800 bg-lime-800 text-white px-2 py-1 rounded-lg text-small hover:font-semibold hover:bg-lime-700 flex gap-2 items-center cursor-pointer"
                        onClick={() => ctx.setPageContext({page: 'edit', surveyId: -1})}
                    >
                        <PlusCircleIcon className="size-6" />
                        <div>New</div>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SurveyListCard />
                <SurveyListCard />
                <SurveyListCard />
                <SurveyListCard />
                <SurveyListCard />
            </div>
        </div>
    );
};
