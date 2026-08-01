/*!
* Dashboard page container and router.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useEffect, useState } from 'react';
import { navigateTo, context } from '@devvit/web/client';
import { DashboardContext, DashboardModalContent, DashboardPageContext } from './DashboardContext';
import { SurveyListPage } from './pages/list/SurveyListPage';
import { SurveyEditorPage } from './pages/editor/SurveyEditorPage';
import { SurveyResultsPage } from './pages/results/SurveyResultsPage';
import { Constants } from '../../shared/constants';
import { BugAntIcon, PaintBrushIcon } from '@heroicons/react/24/solid';
import { DebugPage } from './pages/debug/DebugPage';
import { UserInfoDto } from '../../shared/types/postApi';
import { DashboardToaster } from './shared/components/DashboardToaster';
import { useToaster } from '../shared/toast/useToaster';
import { SurveyViewerPage } from './pages/viewer/SurveyViewerPage';
import { getUserInfo } from './api/dashboardApi';
import { SurveyDashboardLoading } from './SurveyDashboardLoading';
import { DesignLanguagePage } from './pages/design/DesignLanguagePage';

export const SurveyDashboard = () => {
    const [pageContext, setPageContext] = useState<DashboardPageContext>({page: 'list'});
    const [modal, setModal] = useState<DashboardModalContent>(undefined);
    const [toasts, addToast, removeToast] = useToaster();
    const [userInfo, setUserInfo] = useState<UserInfoDto | null | undefined>(undefined);

    // Make API call on initial load
    useEffect(() => {
        const callApi = async () => {
            try {
                setUserInfo(await getUserInfo());
            } catch (e) {
                console.error('[Post Survey] Error fetching user details.');
                setUserInfo(null);
            }
        };
        void callApi();
    }, []);

    // Display skeleton while loading
    if (!userInfo) {
        return (<SurveyDashboardLoading />);
    }

    const dashContext = {
        pageContext,
        setPageContext,
        modal,
        setModal,
        userInfo,
        addToast
    };

    const debugButton = () => {
        return userInfo.allowDev ? (
            <button className="cursor-pointer mr-2" onClick={() => dashContext.setPageContext({page: 'debug'})}>
                <BugAntIcon className="size-4" />
            </button>
        ) : undefined;
    };

    const designButton = () => {
        return context?.subredditName === 'UAT4CommunitySurvey' ? (
            <button className="cursor-pointer mr-2" onClick={() => dashContext.setPageContext({page: 'design'})}>
                <PaintBrushIcon className="size-4" />
            </button>
        ) : undefined;
    };

    return (
        <DashboardContext.Provider value={dashContext}>
            <div className="w-full h-screen overflow-auto">
                <div className="container max-w-screen-lg min-h-screen mx-auto flex flex-col justify-between relative z-0">
                    <div className="px-4">
                        {(() => {
                            if (!userInfo.isMod) {
                                return userInfo.allowDev
                                    ? <DebugPage />
                                    : undefined;
                            }
                            switch (pageContext.page) {
                                case 'edit':
                                    return <SurveyEditorPage />;
                                case 'view':
                                    return <SurveyViewerPage />;
                                case 'results':
                                    return <SurveyResultsPage />;
                                case 'debug':
                                    return <DebugPage />;
                                case 'design':
                                    return <DesignLanguagePage />;
                                case 'list':
                                default:
                                    return <SurveyListPage />;
                            }
                        })()}
                    </div>
                    <footer className="p-2 text-xs flex justify-between items-center rounded-t-lg bg-neutral-200 dark:bg-neutral-700">
                        <div className="max-w-1/2">
                            Visit{' '}
                            <span
                                className="underline cursor-pointer"
                                onClick={() => navigateTo('https://www.reddit.com/r/CommunitySurvey')}
                            >
                                r/CommunitySurvey
                            </span>{' '}
                            for Feedback and Support
                        </div>
                        <div className="max-w-1/2 flex items-center">
                            {designButton()} {debugButton()} v{context?.appVersion ?? Constants.SURVEY_VERSION_DISPLAY}
                            {/*(
                                <>
                                    &nbsp;-&nbsp;
                                    <span onClick={updateApp} className="font-bold border-b-1 cursor-pointer">
                                        Update Available!
                                    </span>
                                </>
                            )*/}
                        </div>
                    </footer>
                </div>
                {modal}
                <DashboardToaster toasts={toasts} removeToast={removeToast} />
            </div>
        </DashboardContext.Provider>
    );
};
