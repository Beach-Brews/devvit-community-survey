/*!
* API endpoints for the survey dashboard.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyDto, SurveyWithQuestionsDto } from '../../../shared/redis/SurveyDto';
import { ApiResponse } from '../../../shared/types/api';
import { SurveyResultSummaryDto } from '../../../shared/redis/ResponseDto';

export const isUserMod = async (): Promise<boolean | null> => {
    const resp = await fetch(`/api/dash/is-mod`);
    return resp.ok ? (await resp.json() as ApiResponse<boolean>)?.result ?? null : null;
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
    return resp.ok;
};

export const closeSurveyById = async (id: string): Promise<boolean> => {
    const resp = await fetch(`/api/dash/survey/${id}/close`, { method: "post" });
    return resp.ok;
};

export const saveSurvey = async (survey: SurveyDto): Promise<boolean> => {
    const resp = await fetch(`/api/dash/survey/${survey.id}`, { method: "post", body: JSON.stringify(survey)});
    return resp.ok;
};

export const getSurveyResultSummary =
    async (surveyId: string): Promise<SurveyResultSummaryDto | null> => {
        const resp = await fetch(`/api/dash/survey/${surveyId}/results`);
        return resp.ok ? (await resp.json() as ApiResponse<SurveyResultSummaryDto>)?.result ?? null : null;
    };
