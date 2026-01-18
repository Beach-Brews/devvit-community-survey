/*!
 * Helper for accessing and saving Redis keys for actions responding to surveys.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { Logger } from '../../util/Logger';
import { redis } from '@devvit/web/server';
import { RedisKeys } from './RedisKeys';
import { Schema } from './Schema';
import { SurveyQuestionDto } from '../../../shared/redis/SurveyDto';
import { UserResponsesDto } from '../../../shared/redis/ResponseDto';
import * as dashRedis from './dashboard';
import { getSurveyById } from './dashboard';
import { genResponseId } from '../../../shared/redis/uuidGenerator';

export { getSurveyById, getQuestionResponseById } from './dashboard';

const assertDataValid = (data: string[], question: SurveyQuestionDto): void => {
    // Error if a value is required, but one not given, or skip if no values and not required.
    if (data.length == 0 || !data[0]) {
        if (question.required)
            throw new Error(`Question is required, but no values given.`);
        return;
    }

    switch (question.type) {
        case 'multi':
            if (data.length > 1)
                throw new Error(`Multi response received ${data.length} responses, but should be one.`);
            return;

        case 'checkbox':
            if (data.length > question.options.length)
                throw new Error(`Checkbox response received ${data.length} responses, but only ${question.options.length} are configured.`);
            return;

        case 'rank':
            if (data.length != question.options.length)
                throw new Error(`Rank response received ${data.length} responses, but expected ${question.options.length}.`);
            return;

        case 'scale': {
            if (data.length > 1)
                throw new Error(`Scale response received ${data.length} responses, but should be one.`);
            const intVal = parseInt(data[0]);
            if (isNaN(intVal) || intVal < question.min || intVal > question.max)
                throw new Error(`Scale value ${data[0]} is outside expected range ${question.min} - ${question.max}`)
            return;
        }
    }
};

const scoreForOp =
    async (questionDto: SurveyQuestionDto, option: string, index: number): Promise<number> => {
        switch (questionDto.type) {
            case 'multi':
            case 'checkbox':
                if (!questionDto.options.some(o => o.value == option))
                    throw new Error(`${questionDto.type} value ${option} does not exist.`);
                return 1;

            case 'scale':
                return 1;

            case 'rank':
                if (!questionDto.options.some(o => o.value == option))
                    throw new Error(`${questionDto.type} value ${option} does not exist.`);
                return questionDto.options.length - index;

            case 'text':
                throw new Error('Unexpected score compute for text type');
        }
    };

export const upsertQuestionResponse =
    async (userId: string, surveyId: string, questionId: string, data: string[]): Promise<boolean> => {

        // Create logger
        const logger = await Logger.Create('Post Redis - Upsert Response');
        logger.traceStart('Start Upsert');

        try {
            logger.debug(userId, surveyId, questionId, data);

            // TODO: Should I add a 5-second lock?

            // Get question config, so score can be computed properly
            const questionDto = await dashRedis.getQuestionById(surveyId, questionId);
            if (!questionDto) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`No question found with ID: ${surveyId}:${questionId}`);
            }

            // Assert response data array makes sense for question type
            assertDataValid(data, questionDto);

            // Get keys
            const responderListKey = RedisKeys.responderList();
            const surveyResponderList = RedisKeys.surveyResponderList(surveyId);
            const responderSurveyListKey = RedisKeys.responderSurveyList(userId);
            const questionResultsKey = RedisKeys.surveyQuestionResults(surveyId, questionId);
            const responseListKey = RedisKeys.responderSurveyResponseList(userId, surveyId);

            // Determine if the user has responded yet (response key exists)
            // TODO: Allow multiple responses
            const isFirstResponse = ((await redis.zScore(surveyResponderList, userId)) ?? 0) <= 0;
            const responseList = await redis.zRange(responseListKey, 0, 1, );
            const responseId = responseList[0]?.member ?? genResponseId();
            const userResponseKey = RedisKeys.responderSurveyResponse(userId, surveyId, responseId);
            const existingResponse = !isFirstResponse ? await redis.hGet(userResponseKey, questionId) : undefined;
            logger.debug(existingResponse ? `Inserting new response ${responseId}` : `Updating existing response ${responseId}`);

            // Start transaction
            const txn = await redis.watch(responderListKey, surveyResponderList, responderSurveyListKey, questionResultsKey, userResponseKey, responseListKey);

            // Add user to survey lists if first response to survey
            if (isFirstResponse) {
                await txn.zIncrBy(surveyResponderList, userId, 1);
                await txn.zIncrBy(surveyResponderList, 'total', 1);
                await txn.hSet(responderSurveyListKey, {[surveyId]: '1'});
                await txn.zAdd(responseListKey, { member: responseId, score: Date.now() });
            }

            // Save last access date for account delete
            await txn.zAdd(responderListKey, {member: userId, score: Date.now()});

            // Save user response
            await txn.hSet(userResponseKey, { [questionId]: JSON.stringify(data) });

            // IF modifying previous response, decrease scores from previous response
            if (existingResponse) {
                const existingArr = await Schema.stringArray.parseAsync(JSON.parse(existingResponse)) as string[];
                for (const [i, op] of existingArr.entries()) {
                    const score = await scoreForOp(questionDto, op, i);
                    await txn.zIncrBy(questionResultsKey, op, -1 * score);
                }

            } else {
                // Otherwise, increase the response count
                await txn.zIncrBy(questionResultsKey, 'total', 1);
            }

            // Then update scores for new response
            for (const [i, op] of data.entries()) {
                const score = await scoreForOp(questionDto, op, i);
                await txn.zIncrBy(questionResultsKey, op, score);
            }

            // Commit
            await txn.exec();

            return !!existingResponse;

        } catch (e) {

            logger.error('Failed to upsert: ', e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };

export const deleteUserResponse =
    async (userId: string, surveyId: string): Promise<boolean> => {

        // Create logger
        const logger = await Logger.Create('Post Redis - Delete Response');
        logger.traceStart('Start Delete');

        try {
            logger.debug(userId, surveyId);

            // Confirm survey exists
            const surveyDto = await getSurveyById(surveyId, true);
            if (!surveyDto?.questions) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`No survey found with ID ${surveyId}`);
            }

            // Get keys
            const responderListKey = RedisKeys.responderList();
            const responderSurveyListKey = RedisKeys.responderSurveyList(userId);
            const surveyResponderListKey = RedisKeys.surveyResponderList(surveyId);
            const responseListKey = RedisKeys.responderSurveyResponseList(userId, surveyId);

            // TODO: Handle delete of single or all responses. This is very messy and needs cleaned up.

            // Get the user's responses
            const userSurveyCount = await redis.hLen(responderSurveyListKey);
            const thisSurveyResponseCount = await redis.zScore(surveyResponderListKey, userId) ?? 0;
            const responseValues = thisSurveyResponseCount > 0
                ? await redis.zRange(responseListKey, 0, thisSurveyResponseCount)
                : [];

            // Get response values
            const responseKeys = responseValues
                .map(r => RedisKeys.responderSurveyResponse(userId, surveyId, r.member));
            const userResponses = await Promise.all(
                responseKeys.map(async (key) => await redis.hGetAll(key))
            );
            const parsedResponses = await Promise.all(
                userResponses.map(async (response) =>
                    await Promise.all(Object.entries(response)
                    .map(async (r) => {
                        return [
                            r[0],
                            RedisKeys.surveyQuestionResults(surveyId, r[0]),
                            await Schema.stringArray.parseAsync(JSON.parse(r[1])) as string[],
                            surveyDto.questions?.find(q => q.id == r[0])
                        ] as [string, string, string[], SurveyQuestionDto | undefined];
                    }))
                )
            );

            // Start transaction
            const txn = await redis.watch(responderListKey, surveyResponderListKey, responderSurveyListKey, responseListKey, ...responseKeys);

            // Delete response from each question
            for (const q of parsedResponses.flatMap(r => r)) {
                // q0 - QuestionId
                // q1 - Question results redis key
                // q2 - User responses
                // q3 - QuestionDto

                if (!q[3]) {
                    logger.warn(`Failed to find a question with ID ${q[0]} in survey ${surveyId}. User ${userId} response not removed from aggregate.`);
                    continue;
                }

                for (const [i, op] of q[2].entries()) {
                    const score = await scoreForOp(q[3], op, i);
                    await txn.zIncrBy(q[1], op, -1 * score);
                }
                await txn.zIncrBy(q[1], 'total', -1);
            }

            // Delete user response key
            await txn.del(...responseKeys);
            await txn.del(responseListKey);

            // Remove user from survey's response list, and survey from user survey list
            await txn.zRem(surveyResponderListKey, [userId]);
            await txn.hDel(responderSurveyListKey, [surveyId]);

            // And decrease response count for this survey
            await txn.zIncrBy(surveyResponderListKey, 'total', -1 * thisSurveyResponseCount);

            // Remove user from responder list if only survey (do not update time, might be processing delete account)
            if (userSurveyCount <= 1)
                await txn.zRem(responderListKey, [userId]);

            // Commit
            await txn.exec();

            return true;

        } catch (e) {

            logger.error('Failed to delete response: ', e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };

export const getUserLastResponse =
    async (userId: string, surveyId: string): Promise<UserResponsesDto | null> => {

        // Create logger
        const logger = await Logger.Create('Post Redis - Get Last Response');
        logger.traceStart('Start Last Response');

        try {
            logger.debug(userId, surveyId);

            // Get keys
            const responseListKey = RedisKeys.responderSurveyResponseList(userId, surveyId);
            const responseList = await redis.zRange(responseListKey, 0, 1, );
            const latestResponseId = responseList[0]?.member;
            if (!latestResponseId) {
                return null;
            }

            // Get all values
            const responseKey = RedisKeys.responderSurveyResponse(userId, surveyId, latestResponseId);
            const userResponses = await redis.hGetAll(responseKey);

            // If no values, no response
            const responses = Object.entries(userResponses);
            if (responses.length <= 0) {
                return null;
            }

            // Parse each response as a string[]
            const parsed = (await Promise.all(responses
                .filter(r => r[0] !== 'meta')
                .map(async (r) => {
                    try {
                        return [r[0], await Schema.stringArray.parseAsync(JSON.parse(r[1]))] as [string, string[]];
                    } catch (error) {
                        logger.error(`Failed to parse response for question ${r[0]}: "${r[1]}" ===`, error);
                        return null;
                    }
                })
            ))
            .filter(r => r !== null);

            // Reduce to an object
            return parsed.reduce((r: UserResponsesDto, i: [string, string[]]) => {
                r[i[0]] = i[1];
                return r;
            }, {} as UserResponsesDto);

        } catch (e) {

            logger.error('Failed to get existing response: ', e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };
