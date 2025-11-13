/*!
* Dashboard inline splashscreen.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/


import { getWebViewMode, navigateTo, requestExpandedMode, WebViewMode } from '@devvit/web/client';
import { MouseEvent, useEffect, useState } from 'react';
import { SurveyDashboard } from './SurveyDashboard';
import { getUserInfo } from './api/dashboardApi';
import { Constants } from '../../shared/constants';
import { UserInfoDto } from '../../shared/types/postApi';

export const SurveyDashboardInline = () => {

    // Create state for mod status. Undefined = loading, Null = error
    const [userInfo, setUserInfo] = useState<UserInfoDto | null | undefined>(undefined);
    const [defaultSnoo] = useState<string>(`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`);
    const allowDashboard = userInfo?.isMod || userInfo?.allowDev || false;

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
    }, [setUserInfo]);

    // If user is a mod and expanded mode is active, render the dashboard
    const renderMode: WebViewMode = getWebViewMode();
    if (userInfo && allowDashboard && renderMode === 'expanded') {
        return (<SurveyDashboard userInfo={userInfo} />);
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
                    {userInfo === undefined && (
                        <>
                            <div className="animate-pulse h-10 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/2"></div>
                            <div className="animate-pulse h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/4"></div>
                        </>
                    )}

                    {/* ===== Error State ===== */}
                    {userInfo === null && (
                        <>
                            <img className="w-1/2" src="snoo-facepalm.png" alt="Snoo Error" />
                            <div className="text-xl text-center">Sorry, there was an error loading the survey.<br />Please try again later.</div>
                        </>
                    )}

                    {/* ===== Non-Moderator State ===== */}
                    {/* TODO: Discuss not being able to access webview posts when post is deleted. Menu item launch would be cool. */}
                    {!allowDashboard && (
                        <>
                            <div className="font-bold text-2xl text-center">Surveys Coming Soon!</div>
                            <div className="text-lg text-center">
                                This post is for moderators to configure surveys for this community. A new post will be
                                created when a survey is accepting responses! Check back soon.
                            </div>
                        </>
                    )}

                    {/* ===== Moderator Launch Dashboard State ===== */}
                    {allowDashboard && (
                        <>
                            <div className="font-bold text-2xl text-center">Survey Dashboard</div>
                            <button className="cursor-pointer px-4 py-2 rounded-md text-white bg-blue-700 dark:bg-blue-900" onClick={launchDashboard}>Launch Dashboard</button>
                        </>
                    )}
                </div>
            </div>
            <footer className="w-full p-2 pt-0 text-xs flex justify-between">
                <div className="w-1/2 flex gap-1 items-center">
                    {userInfo?.userId && (
                        <>
                            <div  className="w-8 h-8 object-contain overflow-hidden rounded-full"><img src={userInfo?.snoovar !== undefined && userInfo.snoovar.length > 0 ? userInfo.snoovar : defaultSnoo} alt={`snoovar for ${userInfo.username}`} /></div> {userInfo.username}
                        </>
                    )}
                    {userInfo?.userId && (
                        <>
                            <img src={defaultSnoo} alt="default snoovar" className="w-8 h-8 rounded-full" /> Anonymous
                        </>
                    )}
                    {userInfo === undefined && (
                        <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/2 animate-pulse "></div>
                    )}
                </div>
                <div className="w-1/2 flex flex-col items-end justify-end">
                    <div><span className="underline cursor-pointer" onClick={() => navigateTo("https://www.reddit.com/r/CommunitySurvey")}>r/CommunitySurvey</span></div>
                    <div className="text-[0.7rem] text-neutral-600 dark:text-neutral-400" >{Constants.SURVEY_VERSION_DISPLAY}</div>
                </div>
            </footer>
        </div>
    );
};
