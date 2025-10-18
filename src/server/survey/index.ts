/*!
 * Registers all paths for the survey front-end.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { ApiResponse, SurveyIdParam } from '../../shared/types/api';
import { PostType } from '../../shared/types/general';
import { SurveyDto } from '../../shared/redis/SurveyDto';
import { Logger } from '../util/Logger';
import {
    messageResponse,
    successResponse,
    surveyNotFoundResponse
} from '../util/apiUtils';
import * as surveyRedis from '../devvit/redis/survey';
import { context } from '@devvit/web/server';

export const registerSurveyRoutes: PathFactory = (router: Router) => {
    router.route('/api/post/survey')
        .get<SurveyIdParam, ApiResponse<SurveyDto>>(async (_req, res) => {
            const logger = await Logger.Create(`Survey API - Get Survey for Post`);
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

                const found = await surveyRedis.getSurveyById(surveyId);
                if (!found) return surveyNotFoundResponse(res, surveyId);

                successResponse(res, found);
            } catch (e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        })
};
