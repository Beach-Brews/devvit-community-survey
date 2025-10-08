/*!
* API to fetch survey list from server.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyDto } from '../../../shared/redis/SurveyDto';

export const getSurveyList = async (): Promise<SurveyDto[]> => {
    // Fetch survey list from API
    const resp = await fetch('/api/survey/list');
    if (!resp.ok) return [];
    const list = await resp.json() as SurveyDto[];

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
    const resp = await fetch(`/api/survey/${id}`);
    return resp.ok ? await resp.json() : undefined;
};

export const deleteSurveyById = async (id: string): Promise<boolean> => {
    const resp = await fetch(`/api/survey/${id}`, { method: "delete" });
    return resp.ok;
};

export const closeSurveyById = async (id: string): Promise<boolean> => {
    const resp = await fetch(`/api/survey/${id}/close`, { method: "patch" });
    return resp.ok;
};

export const saveSurvey = async (survey: SurveyDto): Promise<boolean> => {
    const resp = await fetch(`/api/survey/${survey.id}`, { method: "patch", body: JSON.stringify(survey)});
    return resp.ok;
};
