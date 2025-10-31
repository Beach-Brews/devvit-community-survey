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
                const found = await postRedis.getSurveyById(surveyId);
                if (!found || !found.questions) return surveyNotFoundResponse(res, surveyId);

                // Get responses (if user has any)
                // TODO: Add current / last response to response

                // Get user info
                const userInfo = await reddit.getCurrentUser();
                const [userIsMod, snoovar] = userInfo
                    ? await Promise.all([isMod(userInfo), userInfo.getSnoovatarUrl()])
                    : [false, undefined];

                successResponse(res, {
                    survey: found as SurveyWithQuestionsDto,
                    user: {
                        isMod: userIsMod,
                        username: userInfo?.username ?? 'anonymous',
                        userId: userInfo?.id,
                        snoovar: snoovar
                    }
                } satisfies InitializeSurveyResponse);
            } catch (e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        });

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
};
