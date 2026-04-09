/*!
* Placeholder skeleton for loading survey dashboard.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyListCardLoading } from './pages/list/SurveyListCardLoading';

export const SurveyDashboardLoading = () => {
    return (
        <div className="w-full h-screen overflow-auto">
            <div className="container max-w-screen-lg min-h-screen mx-auto flex flex-col justify-between relative z-0">
                <div className="px-4">
                    <div className="flex justify-between items-center border-b">
                        <h1 className="text-md lg:text-2xl font-bold my-4">Community Survey Dashboard</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        {[
                            <SurveyListCardLoading key="load1" />,
                            <SurveyListCardLoading key="load2" />,
                            <SurveyListCardLoading key="load3" />,
                        ]}
                    </div>
                </div>

                <footer className="p-2 text-xs flex justify-between items-center rounded-t-lg bg-neutral-200 dark:bg-neutral-700">
                    <div className="max-w-1/2">
                        Loading
                    </div>
                    <div className="max-w-1/2 flex items-center">
                        Please wait
                    </div>
                </footer>
            </div>
        </div>
    );
};
