/*!
 * Registers all paths for the survey front-end.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { ApiResponse, MessageResponse, QuestionIdParam } from '../../shared/types/api';
import { PostType } from '../../shared/types/general';
import { SurveyWithQuestionsDto } from '../../shared/redis/SurveyDto';
import { Logger } from '../util/Logger';
import {
    errorIfNoUserId,
    messageResponse,
    successResponse,
    surveyNotFoundResponse,
} from '../util/apiUtils';
import * as postRedis from '../devvit/redis/post';
import { context, reddit } from '@devvit/web/server';
import { InitializeSurveyResponse } from '../../shared/types/postApi';
import { isMod } from '../util/userUtils';
import { QuestionResponseDto } from '../../shared/redis/ResponseDto';
import { debugEnabled } from '../util/debugUtils';

export const registerPostRoutes: PathFactory = (router: Router) => {
    router.route('/api/post/survey')
        .get<void, ApiResponse<InitializeSurveyResponse>>(async (_req, res) => {
            const logger = await Logger.Create(`Post API - Get Survey for Post`);
            logger.traceStart('Api Start');

            try {
                // Error if postData is undefined
                if (!context.postData) {
                    logger.error('PostData missing from context.');
                    return messageResponse(res, 400, 'Missing context', 131);
                }

                // Get postType and surveyId from postData
                const { postType, surveyId } = context.postData;

                // Check postType
                if (postType !== PostType[PostType.Survey]) {
                    logger.error('Post type is not Survey');
                    return messageResponse(res, 400, 'Invalid post type', 132);
                }

                // Check surveyId
                if (!surveyId || typeof surveyId !== 'string') {
                    logger.error(`SurveyID missing from context (or not a string): ${surveyId ?? 'undefined'}`);
                    return messageResponse(res, 400, 'SurveyID missing from context', 133);
                }

                // Get survey configuration
                const found = await postRedis.getSurveyById(surveyId, true);
                if (!found || !found.questions) {
                    logger.error('Survey or Survey Questions not found with ID: ', surveyId);
                    return surveyNotFoundResponse(res, surveyId);
                }

                // Get user info
                const userInfo = await reddit.getCurrentUser();
                const [userIsMod, snoovar] = userInfo
                    ? await Promise.all([isMod(userInfo), userInfo.getSnoovatarUrl()])
                    : [false, undefined];

                // Get responses (if user has any)
                const lastResponse = userInfo?.id !== undefined
                    ? await postRedis.getUserLastResponse(userInfo.id, surveyId)
                    : undefined;

                successResponse(res, {
                    survey: found as SurveyWithQuestionsDto,
                    user: {
                        isMod: userIsMod,
                        allowDev: await debugEnabled(),
                        username: userInfo?.username ?? 'anonymous',
                        userId: userInfo?.id,
                        snoovar: snoovar
                    },
                    lastResponse: lastResponse
                } satisfies InitializeSurveyResponse);
            } catch (e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        });

    router.delete<string, MessageResponse>(
        '/api/post/survey/response',
        async (_req, res) => {
            const logger = await Logger.Create(`Post API - Delete Response`);
            logger.traceStart('Api Start');

            try {
                // Error if user is undefined
                const userId = await errorIfNoUserId(res);
                if (!userId) return;

                // Error if postData is undefined
                if (!context.postData) {
                    logger.error('PostData missing from context.');
                    return messageResponse(res, 400, 'Missing context', 131);
                }

                // Get postType and surveyId from postData
                const { surveyId } = context.postData;

                // Check surveyId
                if (!surveyId || typeof surveyId !== 'string') {
                    logger.error(`SurveyID missing from context (or not a string): ${surveyId ?? 'undefined'}`);
                    return messageResponse(res, 400, 'SurveyID missing from context', 133);
                }

                // Run delete
                await postRedis.deleteUserResponse(userId, surveyId);

                messageResponse(res, 200, 'Response deleted');

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        }
    );

    router.post<QuestionIdParam, MessageResponse>(
        '/api/post/survey/:questionId',
        async (req, res) => {
            const logger = await Logger.Create(`Post API - Question Response ${req?.params?.questionId ?? '{invalid_id}'}`);
            logger.traceStart('Api Start');

            try {
                // Error if user is undefined
                const userId = await errorIfNoUserId(res);
                if (!userId) return;

                // Error if postData is undefined
                if (!context.postData) {
                    logger.error('PostData missing from context.');
                    return messageResponse(res, 400, 'Missing context', 131);
                }

                // Get postType and surveyId from postData
                const { surveyId } = context.postData;

                // Check surveyId
                if (!surveyId || typeof surveyId !== 'string') {
                    logger.error(`SurveyID missing from context (or not a string): ${surveyId ?? 'undefined'}`);
                    return messageResponse(res, 400, 'SurveyID missing from context', 133);
                }

                // Error question ID is missing
                if (!req?.params?.questionId) {
                    logger.error('No question ID.');
                    return messageResponse(res, 400, 'Missing questionID', 132);
                }

                // Get survey to check if closed.
                const surveyDto = await postRedis.getSurveyById(surveyId, false);
                if (!surveyDto) {
                    logger.error('No Survey found with ID: ', surveyId);
                    return surveyNotFoundResponse(res, surveyId);
                }

                // Confirm survey close date (if specified) is not in the past
                if (surveyDto.closeDate && surveyDto.closeDate < Date.now()) {
                    logger.warn('Attempt to respond to closed survey by user blocked: ', surveyId, userId);
                    return messageResponse(res, 400, 'This survey is closed and no longer accepting responses', 122);
                }

                // Run the upsert
                await postRedis.upsertQuestionResponse(userId, surveyId, req.params.questionId, JSON.parse(req.body));

                messageResponse(res, 200, 'Response saved');

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        });

    router.route('/api/post/survey/results/:questionId')
        .get<QuestionIdParam, ApiResponse<QuestionResponseDto>>(async (req, res) => {
            const logger = await Logger.Create(`Dashboard API - Get Survey Result`);
            logger.traceStart('Api Start');

            try {
                // Error if postData is undefined
                if (!context.postData) {
                    logger.error('PostData missing from context.');
                    return messageResponse(res, 400, 'Missing context', 131);
                }

                // Get postType and surveyId from postData
                const { questionId } = req.params;
                const { surveyId } = context.postData;
                logger.debug(surveyId, questionId);

                // Check surveyId
                if (!surveyId || typeof surveyId !== 'string') {
                    logger.error(`SurveyID missing from context (or not a string): ${surveyId ?? 'undefined'}`);
                    return messageResponse(res, 400, 'SurveyID missing from context', 133);
                }

                const found = await postRedis.getQuestionResponseById(surveyId, questionId);
                successResponse(res, found);

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        });
};
