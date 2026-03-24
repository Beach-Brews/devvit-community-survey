/*!
 * Type definitions shared for the dashboard API.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { SurveyDto } from '../redis/SurveyDto';

export type AppUpdateInfoDto = {
    latestVersion: string;
    urgent: boolean;
    message?: string | null | undefined;
};

export type DashboardListDto = {
    appUpdateInfo: AppUpdateInfoDto | undefined;
    surveys: SurveyDto[];
};

export type UserFlairTemplate = {
    id: string;
    text: string;
};

export type SubredditUserFlairsResult = {
    flairs: [UserFlairTemplate];
};
