/*!
 * Type definitions shared for the survey post API.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { SurveyWithQuestionsDto } from '../redis/SurveyDto';
import { UserResponsesDto } from '../redis/ResponseDto';

export enum ResponseBlockedReason {
    ANONYMOUS,
    BANNED,
    NOT_VERIFIED,
    NOT_APPROVED,
    MIN_KARMA,
    MIN_SUB_KARMA,
    USER_FLAIR
}

export type UserInfoDto = {
    isMod: boolean;
    responseBlocked: ResponseBlockedReason | undefined;
    allowDev: boolean;
    username: string;
    userId: string | undefined;
    snoovar: string | undefined;
};

export type InitializeSurveyResponse = {
    survey: SurveyWithQuestionsDto;
    user: UserInfoDto;
    lastResponse: UserResponsesDto | undefined;
};
