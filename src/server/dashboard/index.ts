/*!
 * Registers all paths for the dashboard front-end.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { SurveyDto, SurveyWithQuestionsDto } from '../../shared/redis/SurveyDto';
import { ApiResponse, MessageResponse, QuestionIdParam, SurveyIdParam } from '../../shared/types/api';
import {
    errorIfNotMod,
    errorIfNoUserId,
    messageResponse,
    successResponse,
    surveyNotFoundResponse
} from '../util/apiUtils';
import * as dashRedis from '../devvit/redis/dashboard';
import { Logger } from '../util/Logger';
import { isMod } from '../util/userUtils';
import { registerDashboardDebugRoutes } from './debug';
import { QuestionResponseDto, SurveyResultSummaryDto } from '../../shared/redis/ResponseDto';
import { reddit } from '@devvit/web/server';
import { UserInfoDto } from '../../shared/types/postApi';
import { debugEnabled } from '../util/debugUtils';

export const registerDashboardRoutes: PathFactory = (router: Router) => {

    registerDashboardDebugRoutes(router);

    router.get<void, ApiResponse<UserInfoDto>>(
        "/api/dash/user-info",
        async (_req, res) => {
            const logger = await Logger.Create('Dashboard API - User Details');
            logger.traceStart('Api Start');

            try {
                // Get user info
                const userInfo = await reddit.getCurrentUser();
                const [userIsMod, snoovar] = userInfo
                    ? await Promise.all([isMod(userInfo), userInfo.getSnoovatarUrl()])
                    : [false, undefined];

                return successResponse(res, {
                    isMod: userIsMod,
                    allowDev: await debugEnabled(),
                    username: userInfo?.username ?? 'anonymous',
                    userId: userInfo?.id,
                    snoovar: snoovar
                } satisfies UserInfoDto);

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        }
    );

    router.get<void, ApiResponse<SurveyDto[]>>(
        "/api/dash/survey/list",
        async (_req, res) => {
            const logger = await Logger.Create('Dashboard API - List All');
            logger.traceStart('Api Start');

            try {
                const userId = await errorIfNoUserId(res);
                if (!userId) return;
                if (await errorIfNotMod(res)) return;
                return successResponse(res, await dashRedis.getSurveyListForAuthor(userId));

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        }
    );

    router.post<SurveyIdParam, MessageResponse>(
        '/api/dash/survey/:surveyId/close',
        async (req, res) => {
            const logger = await Logger.Create(`Dashboard API - Close Survey ${req?.params?.surveyId ?? '{invalid_id}'}`);
            logger.traceStart('Api Start');

            try {
                const userId = await errorIfNoUserId(res);
                if (!userId) return;
                if (await errorIfNotMod(res)) return;

                const item = await dashRedis.closeSurveyById(req.params.surveyId);
                if (!item)
                    return surveyNotFoundResponse(res, req.params.surveyId);

                messageResponse(res, 200, 'Survey closed');

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        });

    router.route('/api/dash/survey/:surveyId')
        .get<SurveyIdParam, ApiResponse<SurveyWithQuestionsDto>>(async (req, res) => {
            const logger = await Logger.Create(`Dashboard API - Get Survey ${req?.params?.surveyId ?? '{invalid_id}'}`);
            logger.traceStart('Api Start');

            try {
                const userId = await errorIfNoUserId(res);
                if (!userId) return;
                if (await errorIfNotMod(res)) return;

                const found = await dashRedis.getSurveyById(req.params.surveyId, true);
                if (!found || !found.questions)
                    return surveyNotFoundResponse(res, req.params.surveyId);

                successResponse(res, found);

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        })
        .post<SurveyIdParam, MessageResponse, string>(async (req, res) => {
            const logger = await Logger.Create(`Dashboard API - Upsert Survey ${req?.params?.surveyId ?? '{invalid_id}'}`);
            logger.traceStart('Api Start');
            logger.debug('Request: ', req.body);

            try {
                const userId = await errorIfNoUserId(res);
                if (!userId) return;
                if (await errorIfNotMod(res)) return;

                // Upsert
                const [isNew, postId] = await dashRedis.upsertSurvey(userId, req.params.surveyId, req.body);
                if (postId) {
                    successResponse<string>(res, postId, 200, 'Published survey', 102);
                } else if (!isNew) {
                    messageResponse(res, 200, 'Updated existing survey', 101);
                } else {
                    messageResponse(res, 200, 'Created new survey', 100);
                }

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        })
        .delete<SurveyIdParam, MessageResponse>(async (req, res) => {
            const logger = await Logger.Create(`Dashboard API - Delete Survey ${req?.params?.surveyId ?? '{invalid_id}'}`);
            logger.traceStart('Api Start');

            try {
                const userId = await errorIfNoUserId(res);
                if (!userId) return;
                if (await errorIfNotMod(res)) return;

                const success = await dashRedis.deleteSurveyById(req.params.surveyId);
                if (!success)
                    return surveyNotFoundResponse(res, req.params.surveyId);

                messageResponse(res, 200, 'Deleted survey');

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        });

    router.route('/api/dash/survey/:surveyId/results')
        .get<SurveyIdParam, ApiResponse<SurveyResultSummaryDto>>(async (req, res) => {
            const logger = await Logger.Create(`Dashboard API - Get Survey Summary`);
            logger.traceStart('Api Start');

            try {
                const { surveyId } = req.params;
                logger.debug(surveyId);

                if (await errorIfNotMod(res)) return;

                const found = await dashRedis.getSurveyResultSummary(surveyId);
                if (!found)
                    return surveyNotFoundResponse(res, surveyId);

                successResponse(res, found);

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        });

    router.route('/api/dash/survey/:surveyId/result/:questionId')
        .get<SurveyIdParam & QuestionIdParam, ApiResponse<QuestionResponseDto>>(async (req, res) => {
            const logger = await Logger.Create(`Dashboard API - Get Survey Result`);
            logger.traceStart('Api Start');

            try {
                const { surveyId, questionId } = req.params;
                logger.debug(surveyId, questionId);

                if (await errorIfNotMod(res)) return;

                const found = await dashRedis.getQuestionResponseById(surveyId, questionId);
                if (!found)
                    return messageResponse(res, 404, `No question found with ID: ${surveyId} - ${questionId}`);

                successResponse(res, found);

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        });
};
