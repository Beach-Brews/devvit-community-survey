/*!
* API for getting survey questions and sending responses.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ApiResponse } from '../../../shared/types/api';
import { InitializeSurveyResponse } from '../../../shared/types/postApi';
import { QuestionResponseDto } from '../../../shared/redis/ResponseDto';

export const initializeSurvey = async (): Promise<InitializeSurveyResponse | null> => {
    const resp = await fetch('/api/post/survey');
    return resp.ok ? (await resp.json() as ApiResponse<InitializeSurveyResponse>)?.result ?? null : null;
};

export const getResultsForQuestion = async (questionId: string): Promise<QuestionResponseDto | null> => {
    const resp = await fetch(`/api/post/survey/results/${questionId}`);
    return resp.ok ? (await resp.json() as ApiResponse<QuestionResponseDto>)?.result ?? null : null;
};
