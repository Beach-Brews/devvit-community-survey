/*!
* Dashboard page container and router.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useState } from 'react';
import { navigateTo } from '@devvit/web/client';
import { DashboardContext, DashboardModalContext, DashboardPageContext } from './DashboardContext';
import { SurveyList } from './pages/list/SurveyList';
import { SurveyEditor } from './pages/editor/SurveyEditor';
import { XMarkIcon } from '@heroicons/react/24/solid';

export const SurveyDashboard = () => {
    const [pageContext, setPageContext] = useState<DashboardPageContext>({page: 'list'});
    const [modalContext, setModalContext] = useState<DashboardModalContext>({
        title: 'Test Modal',
        content: (
            <div>
                Hello World!
            </div>
        )
    });

    const context = {
        pageContext,
        setPageContext,
        modalContext,
        setModalContext
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
                                /*case 'results':
                                    return (<div>---</div>);*/
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
                {modalContext && (
                    <div className="z-10 fixed inset-0 w-full h-full flex justify-center items-center bg-black/50">
                        <div className="relative min-w-[500px] max-w-screen-lg min-h-[200px] rounded-md bg-neutral-100 dark:bg-neutral-900 border-1 border-neutral-400 dark:border-neutral-600">
                            {!modalContext.disableClose && (<div className="absolute top-4 right-4 rounded-md hover:bg-neutral-300 hover:dark:bg-neutral-600" onClick={() => setModalContext(undefined)}><XMarkIcon className="cursor-pointer size-8"/></div>)}
                            <div className="text-2xl font-bold p-4 rounded-t-md bg-neutral-200 dark:bg-neutral-800">{modalContext.title}</div>
                            <div className="p-4">
                                {modalContext.content}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardContext.Provider>
    );
};
