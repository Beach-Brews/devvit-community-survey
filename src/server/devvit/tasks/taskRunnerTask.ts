/*!
 * Registers a route for processing periodic scheduled cron tasks.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../../PathFactory';
import { Router } from 'express';
import { Logger } from "../../util/Logger";
import { RedisKeys } from '../redis/RedisKeys';
import { redis, scheduler } from '@devvit/web/server';
import { getSurveyById } from '../redis/dashboard';
import { createSurveyPost } from '../../util/publishUtils';
import { Constants } from '../../../shared/constants';

const publishQueuedSurveys =
    async () => {
        // Create logger
        const logger = await Logger.Create('Task - Publish Surveys');
        logger.traceStart('Start Publish');

        try {
            // Get all the keys in the publishing queue
            const queueKey = RedisKeys.surveyPublishQueue();
            const publishQueue = await redis.hGetAll(queueKey);
            logger.debug(`Found ${publishQueue?.length ?? 0} surveys in publish queue`);

            // Filter any with a date in the future
            const now = Date.now();
            const promiseSurveys = Object.entries(publishQueue)
            .filter(e => parseInt(e[1]) <= now)
            .map(async (e) => await getSurveyById(e[0], false));

            // Fetch config for each survey
            const surveyList = (await Promise.all(promiseSurveys))
            .filter(s => s !== null);
            logger.debug(`Found ${surveyList.length} surveys to publish`);

            // Publish each survey
            for (const survey of surveyList) {
                const post = await createSurveyPost(survey);
                logger.info(`Published survey (${survey.id}) - ${survey.title} - PostID: ${post.id}`);

                // Save postID
                await redis.hSet(RedisKeys.surveyPostList(survey.id), {[post.id]: '1'});

                // And remove after each publish!
                await redis.hDel(queueKey, [survey.id]);
            }

        } catch (e) {

            logger.error('Failed to publish new surveys: ', e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };

const checkDeleteQueue =
    async () => {

        // Create logger
        const logger = await Logger.Create('Task - Check Delete Queue');
        logger.traceStart('Start Check');

        try {
            // Check running jobs
            const jobs = await scheduler.listJobs();
            const deleteRunning = jobs.some(j => j.name == Constants.DELETE_JOB_NAME);
            if (deleteRunning) {
                logger.debug('Delete currently in progress. Skipping.');
                return;
            }

            // Get delete queue
            const queue = await redis.hScan(RedisKeys.surveyDeleteQueue(), 0, undefined, 1);

            // Skip if nothing
            const surveyId = queue.fieldValues?.[0]?.field;
            if (!surveyId) {
                logger.debug('No surveys queued for deletion.');
                return;
            }

            // Queue up a job!
            logger.info('Found survey queued for deletion, but no job scheduled. Scheduling to run now.');
            await scheduler.runJob({
                name: Constants.DELETE_JOB_NAME,
                data: { surveyId },
                runAt: new Date()
            });

        } catch (e) {

            logger.error('Failed to publish new surveys: ', e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };

export const registerTaskRunnerTask: PathFactory = (router: Router) => {

    router.post('/internal/cron/task-runner', async (_req, res): Promise<void> => {
        const logger = await Logger.Create("Task - Runner");
        logger.traceStart("/internal/cron/task-runner");

        try {
            // Publish any queued surveys
            await publishQueuedSurveys();

            // Check for any queued deletes (and start if none scheduled)
            await checkDeleteQueue();

            res.status(200).json({ status: 'ok' });

        } catch (error) {
            logger.error('Error processing task runner: ', error);
            res.status(500).json({
                status: 'error',
                message: 'Error processing task runner'
            });
        } finally {
            logger.traceEnd();
        }
    });
};
