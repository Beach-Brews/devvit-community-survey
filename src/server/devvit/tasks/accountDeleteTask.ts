/*!
 * Registers a route that checks for deleted accounts, and removes their responses.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { redis, reddit } from '@devvit/web/server';
import { PathFactory } from '../../PathFactory';
import { Router } from 'express';
import { Logger } from "../../util/Logger";
import { RedisKeys } from '../redis/RedisKeys';
import { deleteSurveyById } from '../redis/dashboard';
import { deleteUserResponse } from '../redis/post';

class DeleteAccountExecutionLimitError extends Error {

    private readonly _context: DeleteAccountTaskContext;

    constructor(msg: string, ctx: DeleteAccountTaskContext) {
        super(msg);
        this._context = ctx;
    }

    get context() { return this._context; }
}

class DeleteAccountTaskContext {

    private readonly _startTime: number;
    private readonly _logger: Logger;

    get logger() { return this._logger; }
    get runtime() { return ((Date.now() - this._startTime) / 1000).toFixed(2); }

    constructor(logger: Logger) {
        this._startTime = Date.now();
        this._logger = logger;
    }

    public checkTime() {
        if ((Date.now() - this._startTime) > 12000)
            throw new DeleteAccountExecutionLimitError('Execution threshold reached.', this);
    }
}

const onAccountDeleted = async (userId: string, context: DeleteAccountTaskContext) => {
    const logger = await Logger.Create("Trigger - Account Delete");
    logger.traceStart("Start delete");

    try {
        // Get all surveys by author
        const authorSurveys = Object.keys(await redis.hGetAll(RedisKeys.authorSurveyList(userId)));
        if (authorSurveys && authorSurveys.length > 0) {

            // Queue each survey for delete
            let scheduleTimestamp = Date.now();
            for (const surveyId of authorSurveys) {
                await deleteSurveyById(surveyId, new Date(scheduleTimestamp));
                scheduleTimestamp += 300000; // Add 5 minutes each loop
            }

            // NOTE: Survey delete will remove author list once all surveys for user are deleted

            // Return, as we do not want to process responses yet (wait until surveys are deleted)
            return;
        }

        // Check delete time
        context.checkTime();

        // Get all surveys user has responded to
        const userSurveys = Object.keys(await redis.hGetAll(RedisKeys.responderSurveyList(userId)));
        for (const surveyId of userSurveys) {
            await deleteUserResponse(userId, surveyId);
            context.checkTime();
        }

        // NOTE: Delete User Response will remove user from responder list once all responses are deleted.

    } catch(error) {
        logger.error('Error processing account delete trigger: ', error);
        throw error;
    } finally {
        logger.traceEnd();
    }
};

const checkUser = async (userId: string, context: DeleteAccountTaskContext, isAuthor: boolean) => {
    // Check if user exists
    const userProfile = await reddit.getUserById(userId as `t2_${string}`);

    // TODO: Check if user is banned from subreddit? Requires getting current subreddit and looping over users...

    // If the user could not be found (undefined, not error), trigger an onAccountDelete
    if (!userProfile) {
        context.logger.info(`Failed to find a user with ID ${userId}. Triggering account delete.`)
        await onAccountDeleted(userId, context);
        return;
    }

    // If user is active, set last check date
    if (isAuthor) {
        await redis.zAdd(RedisKeys.authorList(), {member: userId, score: Date.now()});
    }
    await redis.zAdd(RedisKeys.responderList(), {member: userId, score: Date.now()});
};

export const registerAccountDeletedTask: PathFactory = (router: Router) => {
    router.post('/internal/task/account-delete-checker', async (_req, res): Promise<void> => {
        const logger = await Logger.Create("Task - Account Delete Checker");
        logger.traceStart("Start task");

        try {
            // If survey delete queue is > 0, skip check for delete accounts
            const deleteQueueKey = RedisKeys.surveyDeleteQueue();
            if ((await redis.hLen(deleteQueueKey)) > 0) {
                logger.info('There are surveys in the delete queue. Skipping user account delete checks until queue empty.');
                return;
            }

            // Create job context
            const deleteContext = new DeleteAccountTaskContext(logger);

            // Milliseconds in 1 day
            const oneDay = 86400000;

            // First, detect any authors not actioned / checked in the last day
            const authorListKey = RedisKeys.authorList();
            const authorsToCheck = await redis.zRange(authorListKey, 0, Date.now() - oneDay, { by: 'score'});
            if (authorsToCheck && authorsToCheck.length > 0) {
                for (const a of authorsToCheck) {
                    await checkUser(a.member, deleteContext, true);
                    deleteContext.checkTime();
                }
            }

            // Second, detect any responders not actioned / checked in the last day
            const responderListKey = RedisKeys.responderList();
            const respondersToCheck = await redis.zRange(responderListKey, 0, Date.now() - oneDay, { by: 'score'});
            if (respondersToCheck && respondersToCheck.length > 0) {
                for (const r of respondersToCheck) {
                    await checkUser(r.member, deleteContext, false);
                    deleteContext.checkTime();
                }
            }

            res.status(200).json({ status: 'complete' });

        } catch (error) {
            logger.error('Error processing account delete trigger: ', error);
            res.status(500).json({
                status: 'error',
                message: 'Error processing account delete trigger'
            });

        } finally {
            logger.traceEnd();
        }
    });
};

