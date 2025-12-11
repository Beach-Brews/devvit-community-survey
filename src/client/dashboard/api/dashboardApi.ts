/*!
* API endpoints for the survey dashboard.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyDto, SurveyWithQuestionsDto } from '../../../shared/redis/SurveyDto';
import { ApiResponse } from '../../../shared/types/api';
import { SurveyResultSummaryDto } from '../../../shared/redis/ResponseDto';
import { UserInfoDto } from '../../../shared/types/postApi';
import { SubredditUserFlairsResult } from '../../../shared/types/dashboardApi';

export const getUserInfo = async (): Promise<UserInfoDto | null> => {
    const resp = await fetch(`/api/dash/user-info`);
    return resp.ok ? (await resp.json() as ApiResponse<UserInfoDto>)?.result ?? null : null;
};

export const getSurveyList = async (): Promise<SurveyDto[]> => {
    // Fetch survey list from API
    const resp = await fetch('/api/dash/survey/list');
    if (!resp.ok) throw new Error('Failed to fetch survey list');
    const apiResponse = await resp.json() as ApiResponse<SurveyDto[]> | undefined;

    // If empty, return empty
    const list = apiResponse?.result;
    if (!list) return [];

    // Sort based on status
    const now = Date.now();
    const sStatus = (s: SurveyDto): number => {
        if (s.deleteQueued) return 5;
        if (s.closeDate && s.closeDate < now) return 1;
        if (s.publishDate && s.publishDate <= now) return 2;
        return s.publishDate && s.publishDate > now ? 3 : 4;
    };
    list.sort((a,b) => sStatus(a) - sStatus(b));

    return list;
};

export const getSurveyById = async (id: string): Promise<SurveyWithQuestionsDto | null> => {
    const resp = await fetch(`/api/dash/survey/${id}`);
    return resp.ok ? (await resp.json() as ApiResponse<SurveyWithQuestionsDto>)?.result ?? null : null;
};

export const deleteSurveyById = async (id: string): Promise<boolean> => {
    const resp = await fetch(`/api/dash/survey/${id}`, { method: "delete" });
    if (!resp.ok)
        throw new Error('Save Survey Failed');
    return true;
};

export const closeSurveyById = async (id: string): Promise<boolean> => {
    const resp = await fetch(`/api/dash/survey/${id}/close`, { method: "post" });
    if (!resp.ok)
        throw new Error('Save Survey Failed');
    return true;
};

export const saveSurvey = async (survey: SurveyDto): Promise<boolean> => {
    const resp = await fetch(`/api/dash/survey/${survey.id}`, { method: "post", body: JSON.stringify(survey)});
    if (!resp.ok)
        throw new Error('Save Survey Failed');
    return true;
};

export const getSurveyResultSummary =
    async (surveyId: string): Promise<SurveyResultSummaryDto | null> => {
        const resp = await fetch(`/api/dash/survey/${surveyId}/results`);
        return resp.ok ? (await resp.json() as ApiResponse<SurveyResultSummaryDto>)?.result ?? null : null;
    };

export const getSubredditUserFlairs =
    async (): Promise<SubredditUserFlairsResult | null> => {
        const resp = await fetch(`/api/dash/flairs`);
        return resp.ok ? (await resp.json() as ApiResponse<SubredditUserFlairsResult>)?.result ?? null : null;
    };
