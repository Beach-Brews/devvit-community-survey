/*!
* Dashboard inline splashscreen.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/


import { getWebViewMode, navigateTo, requestExpandedMode, WebViewMode } from '@devvit/web/client';
import { MouseEvent, useEffect, useState } from 'react';
import { SurveyDashboard } from './SurveyDashboard';
import { isUserMod } from './api/dashboardApi';
import { Constants } from '../../shared/constants';

export const SurveyDashboardInline = () => {

    // Create state for mod status. Undefined = loading, Null = error
    const [isMod, setIsMod] = useState<boolean | null | undefined>(undefined);

    // Make API call on initial load
    useEffect(() => {
        const callApi = async () => {
            try {
                const isMod = await isUserMod();
                setIsMod(isMod);
            } catch (e) {
                console.log('Error fetching user mod state.');
                setIsMod(null);
            }
        };
        void callApi();
    }, [setIsMod]);

    // If user is a mod and expanded mode is active, render the dashboard
    const renderMode: WebViewMode = getWebViewMode();
    if (isMod && renderMode === 'expanded') {
        return (<SurveyDashboard />);
    }

    // Handler for launching into expanded mode
    const launchDashboard = async (e: MouseEvent) => {
        await requestExpandedMode(e.nativeEvent as PointerEvent, 'default');
    };

    return (
        <div className="h-full max-h-full flex flex-col justify-between">
            <div className="p-4 flex-grow h-[0%]">
                <div className="flex flex-col gap-4 justify-center items-center h-full">
                    {/* ===== Loading State ===== */}
                    {isMod === undefined && (
                        <>
                            <div className="animate-pulse h-10 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/2"></div>
                            <div className="animate-pulse h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/4"></div>
                        </>
                    )}

                    {/* ===== Error State ===== */}
                    {isMod === null && (
                        <>
                            <img className="w-1/2" src="snoo-facepalm.png" alt="Snoo Error" />
                            <div className="text-xl text-center">Sorry, there was an error loading the survey.<br />Please try again later.</div>
                        </>
                    )}

                    {/* ===== Non-Moderator State ===== */}
                    {/* TODO: Discuss issue with auto post removal */}
                    {isMod === false && (
                        <>
                            <div className="font-bold text-2xl text-center">Surveys Coming Soon!</div>
                            <div className="text-lg text-center">
                                This post is for moderators to configure surveys for this community. A new post will be
                                created when a survey is accepting responses! Check back soon.
                            </div>
                        </>
                    )}

                    {/* ===== Moderator Launch Dashboard State ===== */}
                    {isMod === true && (
                        <>
                            <div className="font-bold text-2xl text-center">Community Survey - Dashboard</div>
                            <button className="cursor-pointer px-4 py-2 rounded-md text-white bg-blue-700 dark:bg-blue-900" onClick={launchDashboard}>Launch Dashboard</button>
                        </>
                    )}
                </div>
            </div>
            <footer className="w-full p-4 text-xs flex justify-between items-center ">
                <div className="max-w-1/2"><span className="underline cursor-pointer" onClick={() => navigateTo("https://www.reddit.com/r/CommunitySurvey")}>r/CommunitySurvey</span></div>
                <div className="max-w-1/2">{Constants.SURVEY_VERSION_DISPLAY}</div>
            </footer>
        </div>
    );
};
