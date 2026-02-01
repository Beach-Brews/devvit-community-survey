/*!
 * Type definitions shared for the survey post API.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { SurveyWithQuestionsDto } from '../redis/SurveyDto';
import { UserResponsesDto } from '../redis/ResponseDto';

export enum ResultsHiddenReason {
    LIVE,
    NOT_RESPONDED,
    NOT_MOD
}

export enum ResponseBlockedReason {
    ANONYMOUS,
    BANNED,
    MUTED,
    NOT_VERIFIED,
    NOT_APPROVED,
    MIN_AGE,
    MIN_KARMA,
    MIN_COMMENT_KARMA,
    MIN_POST_KARMA,
    MIN_SUB_KARMA,
    MIN_SUB_COMMENT_KARMA,
    MIN_SUB_POST_KARMA,
    USER_FLAIR
}

export type UserInfoDto = {
    isMod: boolean;
    responseBlocked: ResponseBlockedReason | null;
    allowDev: boolean;
    username: string;
    userId: string | undefined;
    snoovar: string | undefined;
};

export type SubredditInfoDto = {
    name: string;
    icon: string | undefined;
};

export type InitializeSurveyResponse = {
    survey: SurveyWithQuestionsDto;
    user: UserInfoDto;
    subInfo: SubredditInfoDto;
    lastResponse: UserResponsesDto | null;
};
