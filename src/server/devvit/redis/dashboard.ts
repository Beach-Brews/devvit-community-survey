/*!
 * Helper for accessing and saving Redis keys for actions in the dashboard.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { redis } from '@devvit/web/server';
import { Schema } from './Schema';
import { SurveyDto, SurveyQuestionList, SurveyWithQuestionsDto } from '../../../shared/redis/SurveyDto';
import { Logger } from '../../util/Logger';
import { createSurveyPost } from '../../util/publishUtils';
import { RedisKeys } from './RedisKeys';

const getSurveyIdsForUser =
    async (userId: string): Promise<string[]> => {
        return await redis.hKeys(RedisKeys.userSurveyList(userId));
    };

const addSurveyIdToUserList =
    async (userId: string, surveyId: string, txn: unknown = undefined): Promise<void> => {

        // Create logger
        const logger = await Logger.Create('Dash Redis - User List Add');
        logger.traceStart('Start User List Add');

        try {
            // TODO: Should I add a 5-second lock?

            // Write configId to user hash
            const userListKey = RedisKeys.userSurveyList(userId);
            if (txn) {
                // @ts-expect-error Ignore txn type
                await txn.hSet(userListKey, { [surveyId]: '1' });
            } else {
                await redis.hSet(userListKey, { [surveyId]: '1' });
            }

            // Write userId to list hash
            const listKey = RedisKeys.userList();
            if (txn) {
                // @ts-expect-error Ignore txn type
                await txn.hSet(listKey, { [userId]: '1' });
            } else {
                await redis.hSet(listKey, { [userId]: '1' });
            }
        } catch(e) {

            logger.error('Error adding survey to user list: ', e);

        } finally {
            logger.traceEnd();
        }
    };

const removeSurveyIdFromUserList =
    async (userId: string, surveyId: string, txn: unknown = undefined): Promise<void> => {

        // TODO: Should I add a 5-second lock?

        // Delete from user survey hash
        const userListKey = RedisKeys.userSurveyList(userId);
        if (txn) {
            // @ts-expect-error Ignore txn type
            await txn.hDel(userListKey, [surveyId]);
        } else {
            await redis.hDel(userListKey, [surveyId]);
        }
    };

// TODO: Add pagination parameter. Is there a way to filter too?
export const getSurveyListForUser =
    async (userId: string): Promise<SurveyDto[]> => {

        const logger = await Logger.Create('Dash Redis - Get List for User');
        logger.traceStart('Start Fetch');

        // Get the list of surveyIds
        const surveyIds = await getSurveyIdsForUser(userId);
        logger.debug('Got IDs: ', surveyIds);

        // If no values returned, return empty array
        if (!surveyIds || surveyIds.length <= 0) return [];

        // Now call mGet with the array to fetch all surveys
        const configs = await redis.mGet(surveyIds.map(i => RedisKeys.surveyConfig(i)));
        logger.debug('Got Configs from Redis: ', configs);

        // TODO: Get response counts via hLen

        // Finally, parse each config
        const asyncParse = configs
            .filter(s => s !== null)
            .map(async (s) =>
                (await Schema.surveyConfig.parseAsync(JSON.parse(s))) satisfies SurveyDto);
        return Promise.all(asyncParse);
    };

export const getSurveyById =
    async (surveyId: string, getQuestions: boolean = true): Promise<SurveyDto | SurveyWithQuestionsDto | null> => {

        // Add survey config to key list to start
        const dataKeys = [RedisKeys.surveyConfig(surveyId)];

        // If wanting questions, add to key list
        if (getQuestions)
            dataKeys.push(RedisKeys.surveyQuestions(surveyId));

        // Fetch both the survey config and question list (if asked)
        const surveyData = await redis.mGet(dataKeys);

        // If first key missing, return null (not found)
        if (surveyData.length < 1 || !surveyData[0]) return null;

        // Parse out survey dto
        const surveyDto: SurveyDto = (await Schema.surveyConfig.parseAsync(JSON.parse(surveyData[0]))) satisfies SurveyDto;

        // Todo: Get response count via hLen

        // Add questions
        if (getQuestions && surveyData.length > 1 && surveyData[1]) {
            surveyDto.questions = (await Schema.surveyQuestionList.parseAsync(JSON.parse(surveyData[1]))) satisfies SurveyQuestionList;
            return surveyDto as SurveyWithQuestionsDto;
        }

        return surveyDto;
    };

export const upsertSurvey =
    async (userId: string, surveyId: string, surveyData: string): Promise<[boolean, string | null]> => {

        // Create logger
        const logger = await Logger.Create('Dash Redis - Upsert');
        logger.traceStart('Start Upsert');

        try {
            logger.debug(userId, surveyId, surveyData);

            // Parse object
            const parsedObj = JSON.parse(surveyData);

            // Add user to config
            parsedObj.id = surveyId;
            parsedObj.owner = userId;

            // Parse data (confirm valid)
            const { questions, ...config } = await Schema.surveyConfigWithQuestions.parseAsync(parsedObj);
            logger.debug(questions, config);

            // Get all keys to watch
            const userListKey = RedisKeys.userList();
            const userSurveyListKey = RedisKeys.userSurveyList(userId);
            const configKey = RedisKeys.surveyConfig(surveyId);
            const questionKey = RedisKeys.surveyQuestions(surveyId);

            // Determine if survey exists or not
            // TODO: Discuss adding hExists with Reddit
            const isNew = !(await redis.hGet(userSurveyListKey, surveyId));
            logger.debug(isNew ? 'Inserting new survey' : 'Updating existing survey');

            // TODO: Should I add a 5-second lock?

            // Start transaction
            const txn = await redis.watch(userListKey, userSurveyListKey, configKey, questionKey);
            await txn.multi();

            // Upsert config + questions (if defined)
            await txn.set(configKey, JSON.stringify(config));

            if (questions)
                await txn.set(questionKey, JSON.stringify(questions));

            // If new, add to user list
            if (isNew)
                await addSurveyIdToUserList(userId, surveyId, txn);

            // If no publish date provided, return
            if (config.publishDate == null) {
                await txn.exec();
                return [isNew, null];
            }

            // If the publishDate within the next 60 seconds, publish immediately!
            const publishNow = config.publishDate <= Date.now() + 60000;
            if (publishNow) {
                await txn.exec();
                const post = await createSurveyPost(config);
                return [isNew, post.id];
            }

            // Otherwise, add a key to the publishing queue
            const surveyPublishQueueKey = RedisKeys.surveyPublishQueue();
            await txn.hSet(surveyPublishQueueKey, { [surveyId]: config.publishDate.toString() });
            await txn.exec();

            return [isNew, null];

        } catch (e) {

            logger.error('Failed to upsert: ', e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };

export const closeSurveyById =
    async (surveyId: string): Promise<boolean> => {

        // Get redis key
        const configKey = RedisKeys.surveyConfig(surveyId);

        // Return false if key does not exist
        if (!(await redis.exists(configKey))) return false;

        // TODO: Should I add a 5-second lock?

        // Start transaction
        const txn = await redis.watch(configKey);
        await txn.multi();

        // Get config
        const confStr = await redis.get(configKey);

        // Return false if not found
        if (!confStr) return false;

        // Parse
        const conf = await Schema.surveyConfig.parseAsync(JSON.parse(confStr));

        // Set close date to now
        conf.closeDate = Date.now();

        // Save and commit
        await txn.set(configKey, JSON.stringify(conf));
        await txn.exec();

        return true;
    };

export const deleteSurveyById =
    async (surveyId: string): Promise<boolean> => {

        // Get the survey, to get user id
        const survey = await getSurveyById(surveyId, false);

        // Return if not found
        if (!survey) return false;

        // Get redis keys
        const userSurveyListKey = RedisKeys.userSurveyList(survey.owner);
        const configKey = RedisKeys.surveyConfig(surveyId);
        const questionKey = RedisKeys.surveyQuestions(surveyId);

        // TODO: Should I add a 5-second lock?

        // Start transaction
        const txn = await redis.watch(userSurveyListKey, configKey, questionKey);
        await txn.multi();

        // Delete two main keys
        await txn.del(configKey);
        await txn.del(questionKey);

        // Remove from list
        await removeSurveyIdFromUserList(survey.owner, surveyId, txn);

        // TODO: How do I clear responses?

        // Commit
        await txn.exec();

        return true;
    };

export const publishQueuedSurveys =
    async () => {
        // Create logger
        const logger = await Logger.Create('Dash Redis - Publish Surveys');
        logger.traceStart('Start Publish');

        try {
            // Get all the keys in the publishing queue
            const publishQueue = await redis.hGetAll(RedisKeys.surveyPublishQueue());
            logger.debug(`Found ${publishQueue.length} surveys in publish queue`);

            // Filter any with a date in the future
            const now = Date.now();
            const promiseSurveys = Object.entries(publishQueue)
                .filter(e => parseInt(e[1]) <= now)
                .map(async (e) => await getSurveyById(e[0]));

            // Publish each survey
            const surveyList = (await Promise.all(promiseSurveys))
                .filter(s => s !== null);
            logger.debug(`Found ${surveyList.length} surveys to publish`);

            // Publish each survey
            for (const survey of surveyList) {
                const post = await createSurveyPost(survey);
                logger.info(`Published survey (${survey.id}) - ${survey.title} - PostID: ${post.id}`);
            }

        } catch (e) {

            logger.error('Failed to publish new surveys: ', e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };
