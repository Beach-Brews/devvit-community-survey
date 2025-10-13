/*!
* API to fetch survey list from server.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyDto } from '../../../shared/redis/SurveyDto';
import { ApiResponse } from '../../../shared/types/api';

export const getSurveyList = async (): Promise<SurveyDto[]> => {
    // Fetch survey list from API
    const resp = await fetch('/api/dash/survey/list');
    if (!resp.ok) return [];
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

export const getSurveyById = async (id: string): Promise<SurveyDto | undefined> => {
    const resp = await fetch(`/api/dash/survey/${id}`);
    return resp.ok ? (await resp.json() as ApiResponse<SurveyDto>)?.result ?? undefined : undefined;
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
