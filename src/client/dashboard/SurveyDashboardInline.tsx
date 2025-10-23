/*!
* Dashboard inline splashscreen.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

/*
import { getWebViewMode, requestExpandedMode } from '@devvit/web/client';
import { MouseEvent } from 'react';
*/

import { requestExpandedMode } from '@devvit/web/client';
import { SurveyDashboard } from './SurveyDashboard';

export const SurveyDashboardInline = () => {

    // TODO: Check if user is moderator. If not, add a "Surveys Coming Soon" type of message.

    return (
        <div>
            <button className="border-1 cursor-pointer px-4 py-2" onClick={e => void requestExpandedMode(e.nativeEvent as PointerEvent)}>Launch Dashboard</button>
            <SurveyDashboard />
        </div>
    );

    // If expanded mode is active, render the dashboard
    /*if (renderMode === 'expanded') {
        return (<SurveyDashboard />);
    }

    // Otherwise, show a button to launch in expanded mode
    const launchDashboard = async (e: MouseEvent) => {
        await requestExpandedMode(e.nativeEvent as PointerEvent);
    };

    return (
        <div className="flex flex-col gap-2 justify-center items-center w-full h-full">
            <div className="text-xl">Community Survey - Dashboard</div>
            <button className="cursor-pointer px-4 py-2 rounded-md text-white bg-blue-700 dark:bg-blue-900" onClick={launchDashboard}>Launch Dashboard</button>
        </div>
    );*/
};
