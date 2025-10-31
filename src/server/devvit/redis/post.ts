﻿/*!
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

export { getSurveyById } from './dashboard';

const addUserToSurveyList =
    async (userId: string, surveyId: string, txn: unknown = undefined): Promise<void> => {
        // Create logger
        const logger = await Logger.Create('Post Redis - Add User to Survey List');
        logger.traceStart('Start User List Add');

        try {
            // TODO: Should I add a 5-second lock?

            // Write configId to user hash
            const userListKey = RedisKeys.surveyResponseUserList(surveyId);
            if (txn) {
                // @ts-expect-error Ignore txn type
                await txn.hSet(userListKey, { [userId]: '1' });
            } else {
                await redis.hSet(userListKey, { [userId]: '1' });
            }

        } catch(e) {

            logger.error('Error adding user to survey list: ', e);

        } finally {
            logger.traceEnd();
        }
    };

export const getQuestionById =
    async (surveyId: string, questionId: string): Promise<SurveyQuestionDto | null> => {

        // Get survey question config
        const questionsKey = RedisKeys.surveyQuestions(surveyId);
        const questionData = await redis.get(questionsKey);

        // Throw if not found
        if (!questionData) {
            throw new Error(`No survey found with ID: ${surveyId}`);
        }

        // Parse questions and find uestion with ID
        // PERF: Hindsight, maybe should store each question in a hash? Then order saved separately?
        const parsedQuestions = await Schema.surveyQuestionList.parseAsync(JSON.parse(questionData))
        const questionConfig = parsedQuestions
            ?.find(q => q.id == questionId);

        return questionConfig ? questionConfig satisfies SurveyQuestionDto : null;
    };

const scoreForOp =
    async (questionDto: SurveyQuestionDto, option: string, index: number): Promise<number> => {
        switch (questionDto.type) {
            case 'multi':
            case 'checkbox':
                return 1;

            case 'scale': {
                const intVal = parseInt(option);
                if (isNaN(intVal) || intVal < questionDto.min || intVal > questionDto.max)
                    throw new Error(`Scale value ${option} is outside expected range ${questionDto.min} - ${questionDto.max}`)
                return 1;
            }

            case 'rank':
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
            const questionDto = await getQuestionById(surveyId, questionId);
            if (!questionDto) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`No question found with ID: ${surveyId}:${questionId}`);
            }

            // Get keys
            const userListKey = RedisKeys.surveyResponseUserList(surveyId);
            const questionResponseKey = RedisKeys.surveyQuestionResponse(surveyId, questionId);
            const userResponseKey = RedisKeys.userSurveyResponse(userId, surveyId);

            // Determine if the user has responded yet (response key exists)
            const existingResponse = await redis.hGet(userResponseKey, questionId);
            logger.debug(existingResponse ? 'Inserting new response' : 'Updating existing response');

            // Start transaction
            const txn = await redis.watch(userListKey, questionResponseKey, userResponseKey);

            // Add user to survey list
            await addUserToSurveyList(userId, surveyId, txn);

            // Save user response
            await txn.hSet(userResponseKey, { [questionId]: JSON.stringify(data) });

            // IF new, decrease scores from previous response
            if (existingResponse) {
                const existingArr = await Schema.stringArray.parseAsync(JSON.parse(existingResponse)) as string[];
                for (const [i, op] of existingArr.entries()) {
                    const score = await scoreForOp(questionDto, op, i);
                    await txn.zIncrBy(questionResponseKey, op, -1 * score);
                }
            }

            // Then update scores for new response
            for (const [i, op] of data.entries()) {
                const score = await scoreForOp(questionDto, op, i);
                await txn.zIncrBy(questionResponseKey, op, score);
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
