/*!
 * Component that displays an app update notice.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { AppUpdateInfoDto } from '../../../../shared/types/dashboardApi';
import { ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { context, navigateTo } from '@devvit/web/client';
import { useState } from 'react';

export type AppUpdateNoticeProps = {
    appUpdateInfo: AppUpdateInfoDto;
};

const updateApp = () => {
    navigateTo(`https://developers.reddit.com/r/${context?.subredditName}/apps`);
};

const viewChangelog = () => {
    navigateTo('https://www.reddit.com/r/CommunitySurvey/wiki/app/changelog');
};

export const AppUpdateNotice = (props: AppUpdateNoticeProps) => {
    const { appUpdateInfo } = props;

    // Get whether version notice is skipped
    const noticeKey = 'sv.skipUpdate';
    const storageValue = window.localStorage.getItem(noticeKey);
    const [showNotice, setShowNotice] = useState<boolean>(storageValue !== appUpdateInfo.latestVersion);

    // On close, add to localstorage and hide
    const closeHandler = () => {
        window.localStorage.setItem(noticeKey, appUpdateInfo.latestVersion);
        setShowNotice(false);
    };

    // If user has opted to hide updaye notice for the latest version, skip render
    if (!showNotice) return undefined;

    const noticeStyle = appUpdateInfo.urgent
        ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700'
        : 'bg-sky-50 dark:bg-sky-950 border-sky-300 dark:border-sky-700';
    const buttonStyle = appUpdateInfo.urgent
        ? 'bg-yellow-200 dark:bg-yellow-800 hover:bg-yellow-300 hover:dark:bg-yellow-700'
        : 'bg-sky-200 dark:bg-sky-800 hover:bg-sky-300 hover:dark:bg-sky-700';
    return (
        <div className={`px-4 py-2 mt-2 text-sm flex justify-between items-center border-1 rounded-md ${noticeStyle}`}>
            <div className="flex gap-2 items-center">
                {appUpdateInfo.urgent ? (
                    <ExclamationTriangleIcon className="size-6" />
                ) : (
                    <InformationCircleIcon className="size-6" />
                )}
                <div>
                    <div>
                        Version {appUpdateInfo.latestVersion} now available!{' '}
                        <span onClick={viewChangelog} className="underline cursor-pointer">
                            View Change Log
                        </span>
                        .
                    </div>
                    {appUpdateInfo.message && <div>{appUpdateInfo.message}</div>}
                </div>
            </div>
            <div className="flex justify-end items-center gap-4">
                <button className={`px-2 py-1 cursor-pointer rounded-md ${buttonStyle}`} onClick={updateApp}>
                    Update Now
                </button>
                <button className="cursor-pointer" onClick={closeHandler}>
                    <XMarkIcon className="size-6" />
                </button>
            </div>
        </div>
    );
};
