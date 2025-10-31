﻿/*!
 * Helper for keeping Redis keys consistent.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { assertSurveyId, assertUserId, assertQuestionId } from '../../../shared/redis/uuidGenerator';

export const RedisKeys = {
    userList: () => `usr:all`,
    userSurveyList: (userId: string) => {
        assertUserId(userId);
        return `usr:${userId}:svs`;
    },
    surveyConfig: (surveyId: string) => {
        assertSurveyId(surveyId);
        return `sv:${surveyId}:conf`;
    },
    surveyQuestions: (surveyId: string) => {
        assertSurveyId(surveyId);
        return `sv:${surveyId}:qns`;
    },
    surveyPublishQueue: () => `sv:pub`,

    surveyResponseUserList: (surveyId: string) => {
        assertSurveyId(surveyId);
        return `sv:${surveyId}:usr`;
    },
    surveyQuestionResponse: (surveyId: string, questionId: string) => {
        assertSurveyId(surveyId);
        assertQuestionId(questionId);
        return `sv:${surveyId}:qn:${questionId}`;
    },
    userSurveyResponse: (userId: string, surveyId: string) => {
        assertUserId(userId);
        assertSurveyId(surveyId);
        return `usr:${userId}:svr:${surveyId}`;
    }
};
