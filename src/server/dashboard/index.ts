/*!
 * Registers all paths for the dashboard front-end.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { SurveyDto } from '../../shared/redis/SurveyDto';
import { ApiResponse, MessageResponse } from '../../shared/types/api';
import {
    errorIfNotMod,
    errorIfNoUserId,
    messageResponse,
    successResponse,
    surveyNotFoundResponse,
} from '../util/apiUtils';
import * as dashRedis from '../devvit/redis/dashboard';
import { Logger } from '../util/Logger';

type SurveyIdParam = {surveyId: string};

export const registerDashboardRoutes: PathFactory = (router: Router) => {

    router.get<void, ApiResponse<SurveyDto>[]>(
        "/api/dash/survey/list",
        async (_req, res) => {
            const logger = await Logger.Create('Dashboard API - List All');
            logger.traceStart('Api Start');

            try {
                const userId = await errorIfNoUserId(res);
                if (!userId) return;
                if (await errorIfNotMod(res)) return;
                return successResponse(res, await dashRedis.getSurveyListForUser(userId));

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

                // TODO: Potentially check if user ID matches? Security risk of other mods modifying another's survey if ID known.
                // Might be "expected" if future allows all mods to modify all surveys.

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
        .get<SurveyIdParam, ApiResponse<SurveyDto>>(async (req, res) => {
            const logger = await Logger.Create(`Dashboard API - Get Survey ${req?.params?.surveyId ?? '{invalid_id}'}`);
            logger.traceStart('Api Start');

            try {
                const userId = await errorIfNoUserId(res);
                if (!userId) return;
                if (await errorIfNotMod(res)) return;

                const found = await dashRedis.getSurveyById(req.params.surveyId);
                if (!found)
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

                // TODO: Potentially check if user ID matches? Security risk of other mods modifying another's survey if ID known.
                // Might be "expected" if future allows all mods to modify all surveys.

                // Upsert
                const isNew = await dashRedis.upsertSurvey(userId, req.params.surveyId, req.body);
                if (!isNew) {
                    messageResponse(res, 200, 'Updated existing survey', 100);
                } else {
                    messageResponse(res, 200, 'Created new survey', 101);
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

                // TODO: Potentially check if user ID matches? Security risk of other mods modifying another's survey if ID known.
                // Might be "expected" if future allows all mods to modify all surveys.

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
};
