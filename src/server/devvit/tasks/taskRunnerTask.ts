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
import { context, reddit, redis, scheduler } from '@devvit/web/server';
import { getSurveyById } from '../redis/dashboard';
import { createSurveyPost } from '../../util/publishUtils';
import { Constants } from '../../../shared/constants';
import { Schema } from '../redis/Schema';
import { AppUpdateInfoDto } from '../../../shared/types/dashboardApi';

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

        } finally {
            logger.traceEnd();
        }
    };

const checkAppUpdate =
    async () => {
        // Create logger
        const logger = await Logger.Create('Task - Check App Update');
        logger.traceStart('Start Check');

        try {
            // Get value stored in Redis
            const redisKey = RedisKeys.appUpdateInfo();
            const redisVal = await redis.hGetAll(redisKey);
            logger.debug('Existing redis data: ', redisVal);

            // Only check wiki every hour
            const lastCheck = redisVal.time ? parseInt(redisVal.time) : NaN;
            if (!isNaN(lastCheck) && lastCheck > Date.now()-3600000) {
                logger.debug('Last check less than 1 hour ago. No check needed.');
                return;
            }

            // Read update wiki page from r/CommunitySurvey
            const wikiPage = await reddit.getWikiPage(Constants.COMMUNITY_SURVEY_SUB, Constants.UPDATE_WIKI_PATH);
            const wikiContent = wikiPage.content;
            logger.debug('Fetched wiki content: ', wikiContent);

            // If empty, print warning
            if (!wikiContent) {
                logger.warn('Update Info Wiki Empty');
                await redis.hSet(redisKey, { 'time': Date.now().toString() });
                return;
            }

            // If redis matches wiki content, no problem!
            if (redisVal.content === wikiContent) {
                logger.debug('Redis value matches wiki content. No update needed.');
                await redis.hSet(redisKey, { 'time': Date.now().toString() });
                return;
            }

            // Parse the wiki page
            const wikiDto = (await Schema.appUpdateInfo.parseAsync(JSON.parse(wikiContent))) satisfies AppUpdateInfoDto;

            // If latest version in wiki matches the app version, no problem!
            if (wikiDto.latestVersion === context.appVersion) {
                logger.debug(`App version ${context.appVersion} matches wiki latestVersion ${wikiDto.latestVersion}`);
                await redis.hSet(redisKey, {
                    'time': Date.now().toString(),
                    'content': wikiContent,
                    'update': 'false'
                });
                return;
            }

            // If version string doesn't match, parse out the version number parts (confirm wiki > installed)
            const wikiVersion = wikiDto.latestVersion.match(/^\d+\.\d+\.\d+.*$/)
                ? wikiDto.latestVersion.split('.').map(Number)
                : null;
            const appVersion = context.appVersion.match(/^\d+\.\d+\.\d+.*$/)
                ? context.appVersion.split('.').map(Number)
                : null;

            // If failed to parse the parts, warn and return
            if (!wikiVersion || !appVersion) {
                logger.warn(`Failed to parse wiki version '${wikiVersion?.[0]}' or app version '${appVersion?.[0]}' parts`);
                return;
            }

            // Check if wiki version is newer
            const compVersion = () => {
                for (let i = 0; i < 3; i++) {
                    const wiki = wikiVersion[i] ?? 0;
                    const app = appVersion[i] ?? 0;
                    if (wiki > app) return true;
                    if (wiki < app) return false;
                }
                return false;
            };
            const hasUpdate = compVersion();
            logger.info(`Wiki version ${wikiDto.latestVersion} ${hasUpdate ? 'greater than' : 'less than or equal to'} installed version ${context.appVersion}.`);

            // Save wiki content to redis
            await redis.hSet(redisKey, {
                'time': Date.now().toString(),
                'content': wikiContent,
                'update': hasUpdate.toString()
            });
        } catch (e) {

            logger.error('Failed to check update wiki: ', e);

            try {
                await redis.hSet(RedisKeys.appUpdateInfo(), { 'time': Date.now().toString() });
            } catch(e2) {
                logger.error('Failed to update app update last check time: ', e2);
            }

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

            logger.error('Failed to check delete queue: ', e);

        } finally {
            logger.traceEnd();
        }
    };

export const registerTaskRunnerTask: PathFactory = (router: Router) => {

    router.post('/internal/cron/task-runner', async (_req, res): Promise<void> => {
        const logger = await Logger.Create("Task - Runner");
        logger.traceStart("/internal/cron/task-runner");

        // Save start time
        const startTime = Date.now();

        try {
            // Publish any queued surveys
            await publishQueuedSurveys();
            
            // Check centralized wiki page for app update notices
            await checkAppUpdate();

            // Check for any queued deletes (and start if none scheduled)
            await checkDeleteQueue();

            // Print status
            logger.info(`Tasks completed in ${(Date.now() - startTime)}ms`);

            res.status(200).json({ status: 'ok' });

        } catch (error) {
            logger.error(`Error processing task runner after ${(Date.now() - startTime)}ms: `, error);
            res.status(500).json({
                status: 'error',
                message: 'Error processing task runner'
            });
        } finally {
            logger.traceEnd();
        }
    });
};
