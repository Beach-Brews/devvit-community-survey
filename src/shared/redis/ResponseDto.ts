/*!
 * DTOs for Redis schema objects, used to pass result information between client and server.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { SurveyDto } from './SurveyDto';

export type UserResponsesDto = { [key: string]: string[]; };

export type ResponseValuesDto = { [key: string]: number; };

export type QuestionResponseDto = {
    responses: ResponseValuesDto;
    total: number;
};

export type SurveyResultListDto = { [qId: string]: QuestionResponseDto; };

export type SurveyResultSummaryDto = {
    survey: SurveyDto;
    results: SurveyResultListDto;
}
