/*!
 * Registers a route for the delete survey one-off job. It deletes all responses, rescheduling if necessary.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../../PathFactory';
import { Router } from 'express';
import { Logger } from "../../util/Logger";
import { RedisKeys } from '../redis/RedisKeys';
import { redis } from '@devvit/web/server';
import { getSurveyById } from '../redis/dashboard';
import { SurveyDto } from '../../../shared/redis/SurveyDto';

class DeleteExecutionLimitError extends Error {

    private readonly _context: DeleteTaskContext;

    constructor(msg: string, ctx: DeleteTaskContext) {
        super(msg);
        this._context = ctx;
    }

    get context() { return this._context; }
}

class DeleteTaskContext {

    private readonly _survey: SurveyDto;
    private readonly _startTime: number;
    private readonly _logger: Logger;

    get survey() { return this._survey; }
    get logger() { return this._logger; }
    get runtime() { return ((Date.now() - this._startTime) / 1000).toFixed(2); }

    constructor(survey: SurveyDto, logger: Logger) {
        this._survey = survey;
        this._startTime = Date.now();
        this._logger = logger;
    }

    public checkTime() {
        if ((Date.now() - this._startTime) > 25000)
            throw new DeleteExecutionLimitError('Execution threshold reached.', this);
    }
}

const deleteUserResponses = async (ctx: DeleteTaskContext) => {

    // Check if there are records to process
    const responderListKey = RedisKeys.responderList();
    const surveyResponseKey = RedisKeys.surveyResponderList(ctx.survey.id);
    const total = await redis.zCard(surveyResponseKey); // NOTE: includes a member named "total"
    if (total <= 1) {
        ctx.logger.info('No responses found for deletion.');
        return;
    }

    ctx.logger.info(`Starting to delete ${total} user responses.`);

    let cursor = 0;
    do {
        // Process deletes in batches (so time can be checked)
        const scan = await redis.zScan(surveyResponseKey, cursor, undefined, 500);
        cursor = scan.cursor;
        ctx.logger.info(`Deleting batch of ${scan.members.length} responses. Current runtime: ${ctx.runtime}s`);

        // For each user in batch, delete their response.
        const userIds: string[] = [];
        for (const v of scan.members) {
            if (v.member === 'total') continue;
            const userResponseKey = RedisKeys.userSurveyResponse(v.member, ctx.survey.id);
            await redis.del(userResponseKey); // TODO: Multiple responses
            if ((await redis.zIncrBy(responderListKey, v.member, -1 * v.score)) <= 0)
                await redis.zRem(responderListKey, [v.member]);
            userIds.push(v.member);
        }

        // Delete batch of users from hash (ensures if job is rescheduled for timing, picks up where it left off)
        await redis.zRem(surveyResponseKey, userIds);

        // Check runtime for potential time limit
        ctx.checkTime();

    } while(cursor != 0);

    // Finally, delete key
    await redis.del(surveyResponseKey);

    ctx.logger.info(`Completed deleting user responses. Current runtime: ${ctx.runtime}s`);
};

const deleteQuestionResponses = async (ctx: DeleteTaskContext) => {

    if (!ctx.survey.questions) return;

    const surveyId = ctx.survey.id;
    const questionResultKeys = ctx.survey.questions.map(q => RedisKeys.surveyQuestionResults(surveyId, q.id));
    ctx.logger.info(`Starting to delete ${questionResultKeys.length} question responses. Current runtime: ${ctx.runtime}s`);

    // TODO: This might be slow if there are a lot of questions. Limit is 25 right now, so should hopefully be safe?
    await redis.del(...questionResultKeys);

    ctx.logger.info(`Completed deleting question responses. Current runtime: ${ctx.runtime}s`);
};

export const registerDeleteSurveyTask: PathFactory = (router: Router) => {
    router.post('/internal/task/delete-survey', async (req, res): Promise<void> => {
        const logger = await Logger.Create("Task - Delete Survey");
        logger.traceStart("/internal/task/delete-survey");

        try {
            // Confirm survey ID was provided
            const surveyId = req.body?.data?.surveyId;
            logger.debug(`Survey ID: ${surveyId}`);
            if (!surveyId || typeof surveyId !== 'string') {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`Survey ID missing or not a string: ${req.body}`);
            }

            // Confirm the survey exists
            const surveyDto = await getSurveyById(surveyId, true);
            if (!surveyDto) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`Survey with ID ${surveyId} could not be found.`);
            }

            // Confirm queued for delete
            if (!surveyDto.deleteQueued) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`Survey with ID ${surveyId} is not queued for deletion.`);
            }

            // Get context
            const context = new DeleteTaskContext(surveyDto, logger);

            // Remove from publish queue
            const pubKey = RedisKeys.surveyPublishQueue();
            if ((await redis.hDel(pubKey, [surveyId])) > 0)
                logger.info('Survey removed from publish queue.');

            // Delete user responses
            await deleteUserResponses(context);

            // Delete question responses
            await deleteQuestionResponses(context);

            // Delete survey config and question keys
            const questionKey = RedisKeys.surveyQuestions(surveyId);
            const configKey = RedisKeys.surveyConfig(surveyId);
            await redis.del(questionKey, configKey);
            logger.info('Removed survey configs');

            // Delete survey from author survey list
            const authorSurveyListKey = RedisKeys.authorSurveyList(surveyDto.owner);
            await redis.hDel(authorSurveyListKey, [surveyId]);
            logger.info('Removed from user survey list');

            // Decrease author list (or remove from list if no surveys left)
            const authorListKey = RedisKeys.authorList();
            const authorSurveyCount = (await redis.zIncrBy(authorListKey, surveyDto.owner, -1));
            if (authorSurveyCount <= 0)
                await redis.zRem(authorListKey, [surveyDto.owner]);

            // Finally, delete from delete queue
            const delKey = RedisKeys.surveyDeleteQueue();
            await redis.hDel(delKey, [surveyId]);
            logger.info('Removed from delete queue. Delete complete.');

            res.status(200).json({ status: 'ok' });

        } catch (error) {

            // If a limit error...
            if (error instanceof DeleteExecutionLimitError) {
                logger.warn(`Execution limit reached for survey ${error.context.survey.id} after ${error.context.runtime}s`);
                res.status(429).json({
                    status: 'limit',
                    message: 'Time limit reached'
                });
                return;
            }

            logger.error('Error processing survey deletion: ', error);
            res.status(500).json({
                status: 'error',
                message: 'Error processing survey deletion'
            });

        } finally {
            logger.traceEnd();
        }
    });
};
