/*!
 * Type definitions shared for the survey post API.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { SurveyWithQuestionsDto } from '../redis/SurveyDto';

export type UserInfoDto = {
    isMod: boolean;
    username: string;
    userId: string | undefined;
    snoovar: string | undefined;
};

export type InitializeSurveyResponse = {
    survey: SurveyWithQuestionsDto;
    user: UserInfoDto;
};
