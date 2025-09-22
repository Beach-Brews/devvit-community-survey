/*!
* Dashboard page container and router.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useState } from 'react';
import { navigateTo } from '@devvit/web/client';
import { DashboardContext, DashboardModalContent, DashboardPageContext } from './DashboardContext';
import { SurveyList } from './pages/list/SurveyList';
import { SurveyEditor } from './pages/editor/SurveyEditor';
import { SurveyResults } from './pages/results/SurveyResults';

export const SurveyDashboard = () => {
    const [pageContext, setPageContext] = useState<DashboardPageContext>({page: 'list'});
    const [modal, setModal] = useState<DashboardModalContent>(undefined);

    const context = {
        pageContext,
        setPageContext,
        modal,
        setModal
    };

    return (
        <DashboardContext.Provider value={context}>
            <div className="w-full min-h-screen">
                <div className="container max-w-screen-lg min-h-screen mx-auto flex flex-col justify-between relative z-0">
                    <div className="px-4">
                        {(() => {
                            switch (pageContext.page) {
                                case 'edit':
                                    return <SurveyEditor />;
                                case 'results':
                                    return <SurveyResults />;
                                case 'list':
                                default:
                                    return <SurveyList />;
                            }
                        })()}
                    </div>
                    <footer className="p-2 text-xs flex justify-between items-center rounded-t-lg bg-neutral-200 dark:bg-neutral-700">
                        <div className="max-w-1/2">Visit <span className="underline cursor-pointer" onClick={() => navigateTo("https://www.reddit.com/r/CommunitySurvey")}>r/CommunitySurvey</span> for Feedback and Support</div>
                        <div className="max-w-1/2">Community-Survey Pre-Alpha</div>
                    </footer>
                </div>
                {modal}
            </div>
        </DashboardContext.Provider>
    );
};
