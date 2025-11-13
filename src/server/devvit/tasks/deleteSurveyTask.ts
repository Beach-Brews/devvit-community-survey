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
    const surveyResponseKey = RedisKeys.surveyResponseUserList(ctx.survey.id);
    const total = await redis.hLen(surveyResponseKey);
    if (total <= 0) {
        ctx.logger.info('No responses found for deletion.');
        return;
    }

    ctx.logger.info(`Starting to delete ${total} user responses.`);

    let cursor = 0;
    do {
        // Process deletes in batches (so time can be checked)
        const scan = await redis.hScan(surveyResponseKey, cursor, undefined, 500);
        cursor = scan.cursor;
        ctx.logger.info(`Deleting batch of ${scan.fieldValues.length} responses. Current runtime: ${ctx.runtime}s`);

        // For each user in batch, delete their response.
        const userIds: string[] = [];
        for (const v of scan.fieldValues) {
            const userResponseKey = RedisKeys.userSurveyResponse(v.field, ctx.survey.id);
            await redis.del(userResponseKey);
            userIds.push(v.field);
        }

        // Delete batch of users from hash
        await redis.hDel(surveyResponseKey, userIds);

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
    const questionIds = ctx.survey.questions.map(q => RedisKeys.surveyQuestionResponse(surveyId, q.id));
    ctx.logger.info(`Starting to delete ${questionIds.length} question responses. Current runtime: ${ctx.runtime}s`);

    // TODO: This might be slow if there are a lot of questions. Limit is 25 right now, so should hopefully be safe?
    await redis.del(...questionIds);

    ctx.logger.info(`Completed deleting question responses. Current runtime: ${ctx.runtime}s`);
};

export const registerDeleteSurveyTask: PathFactory = (router: Router) => {
    router.post('/internal/task/delete-survey', async (req, res): Promise<void> => {
        const logger = await Logger.Create("Task - Publish Check");
        logger.traceStart("/internal/task/delete-survey");

        try {
            // Confirm survey ID was provided
            const surveyId = req.body.surveyId ?? JSON.parse(req.body)?.surveyId;
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

            // Delete survey from user survey list
            const userListKey = RedisKeys.userSurveyList(surveyDto.owner);
            await redis.hDel(userListKey, [surveyId]);
            logger.info('Removed from user survey list');

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
