/*!
* Dashboard page container and router.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useState } from 'react';
import { navigateTo } from '@devvit/web/client';
import { DashboardContext, DashboardModalContent, DashboardPageContext } from './DashboardContext';
import { SurveyListPage } from './pages/list/SurveyListPage';
import { SurveyEditorPage } from './pages/editor/SurveyEditorPage';
import { SurveyResultsPage } from './pages/results/SurveyResultsPage';
import { Constants } from '../../shared/constants';
import { BugAntIcon } from '@heroicons/react/24/solid';
import { DebugPage } from './pages/debug/DebugPage';
import { UserInfoDto } from '../../shared/types/postApi';

interface SurveyDashboardProps {
    userInfo: UserInfoDto;
}

export const SurveyDashboard = (props: SurveyDashboardProps) => {
    const [pageContext, setPageContext] = useState<DashboardPageContext>({page: 'list'});
    const [modal, setModal] = useState<DashboardModalContent>(undefined);

    const dashContext = {
        pageContext,
        setPageContext,
        modal,
        setModal,
        userInfo: props.userInfo
    };

    const debugButton = () => {
        return props.userInfo.allowDev ? (
            <button className="cursor-pointer mr-2" onClick={() => dashContext.setPageContext({page: 'debug'})}>
                <BugAntIcon className="size-4" />
            </button>
        ) : undefined;
    };

    return (
        <DashboardContext.Provider value={dashContext}>
            <div className="w-full h-screen overflow-auto">
                <div className="container max-w-screen-lg min-h-screen mx-auto flex flex-col justify-between relative z-0">
                    <div className="px-4">
                        {(() => {
                            if (!props.userInfo.isMod) {
                                return props.userInfo.allowDev
                                    ? <DebugPage />
                                    : undefined;
                            }
                            switch (pageContext.page) {
                                case 'edit':
                                    return <SurveyEditorPage />;
                                case 'results':
                                    return <SurveyResultsPage />;
                                case 'debug':
                                    return <DebugPage />;
                                case 'list':
                                default:
                                    return <SurveyListPage />;
                            }
                        })()}
                    </div>
                    <footer className="p-2 text-xs flex justify-between items-center rounded-t-lg bg-neutral-200 dark:bg-neutral-700">
                        <div className="max-w-1/2">Visit <span className="underline cursor-pointer" onClick={() => navigateTo("https://www.reddit.com/r/CommunitySurvey")}>r/CommunitySurvey</span> for Feedback and Support</div>
                        <div className="max-w-1/2 flex items-center">{debugButton()}{Constants.SURVEY_VERSION_DISPLAY}</div>
                    </footer>
                </div>
                {modal}
            </div>
        </DashboardContext.Provider>
    );
};
