/*!
 * Helper for accessing and saving Redis keys for actions in the dashboard.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { context, reddit, redis, scheduler } from '@devvit/web/server';
import { Schema } from './Schema';
import {
    SurveyDto,
    SurveyQuestionDto,
    SurveyQuestionList,
    SurveyWithQuestionsDto,
} from '../../../shared/redis/SurveyDto';
import { Logger } from '../../util/Logger';
import { createSurveyPost } from '../../util/publishUtils';
import { RedisKeys } from './RedisKeys';
import { QuestionResponseDto, ResponseValuesDto, SurveyResultListDto, SurveyResultSummaryDto } from '../../../shared/redis/ResponseDto';
import { Constants } from '../../../shared/constants';

const getSurveyIdsForUser =
    async (userId: string): Promise<string[]> => {
        return await redis.hKeys(RedisKeys.authorSurveyList(userId));
    };

const addSurveyIdToUserList =
    async (userId: string, surveyId: string, txn: unknown = undefined): Promise<void> => {

        // Create logger
        const logger = await Logger.Create('Dash Redis - User List Add');
        logger.traceStart('Start User List Add');

        try {
            // TODO: Should I add a 5-second lock?

            // Write configId to user hash
            const authorSurveyListKey = RedisKeys.authorSurveyList(userId);
            if (txn) {
                // @ts-expect-error Ignore txn type
                await txn.hSet(authorSurveyListKey, { [surveyId]: '1' });
            } else {
                await redis.hSet(authorSurveyListKey, { [surveyId]: '1' });
            }

            // Write userId to list hash
            const authorListKey = RedisKeys.authorList();
            if (txn) {
                // @ts-expect-error Ignore txn type
                await txn.zIncrBy(authorListKey, userId, 1);
            } else {
                await redis.zIncrBy(authorListKey, userId, 1);
            }
        } catch(e) {

            logger.error('Error adding survey to user list: ', e);

        } finally {
            logger.traceEnd();
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

        // Get response count for each result
        const deleteQueueKey = RedisKeys.surveyDeleteQueue();
        const responseCountPromise = surveyIds
            .map(async (sid) =>
                [sid, [
                    await redis.zScore(RedisKeys.surveyResponderList(sid), 'total'),
                    (await redis.hGet(deleteQueueKey, sid)) !== undefined
                ]] as const
            );
        const responseCounts = new Map(await Promise.all(responseCountPromise));
        logger.debug('Got response counts from Redis: ', responseCounts);

        // Finally, parse each config
        const asyncParse = configs
            .filter(s => s !== null)
            .map(async (s) => {
                const dto: SurveyDto = await Schema.surveyConfig.parseAsync(JSON.parse(s)) satisfies SurveyDto;
                const responseCount = responseCounts.get(dto.id);
                if (responseCount) {
                    dto.responseCount = responseCount[0] ?? 0;
                    dto.deleteQueued = responseCount[1];
                }
                return dto;
            });
        return Promise.all(asyncParse);
    };

export const getSurveyById =
    async (surveyId: string, getQuestions: boolean): Promise<SurveyDto | SurveyWithQuestionsDto | null> => {

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

        // Get number of responses
        const resultKey = RedisKeys.surveyResponderList(surveyId);
        surveyDto.responseCount = await redis.zScore(resultKey, 'total') ?? 0;

        // Check if queued for delete
        const deleteKey = RedisKeys.surveyDeleteQueue();
        surveyDto.deleteQueued = (await redis.hGet(deleteKey, surveyId)) !== undefined;

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
            const authorListKey = RedisKeys.authorList();
            const authorSurveyListKey = RedisKeys.authorSurveyList(userId);
            const configKey = RedisKeys.surveyConfig(surveyId);
            const questionKey = RedisKeys.surveyQuestions(surveyId);

            // Determine if survey exists or not
            const isNew = (await redis.exists(configKey)) == 0;
            logger.debug(isNew ? 'Inserting new survey' : 'Updating existing survey');

            // TODO: Should I add a 5-second lock?

            // Start transaction
            const txn = await redis.watch(authorListKey, authorSurveyListKey, configKey, questionKey);
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
        const pubQueueKey = RedisKeys.surveyPublishQueue();
        const deleteQueueKey = RedisKeys.surveyDeleteQueue();
        const postListKey = RedisKeys.surveyPostList(surveyId);

        // Remove from publish queue
        await redis.hDel(pubQueueKey, [surveyId]);

        // Add to delete queue
        await redis.hSet(deleteQueueKey, {[surveyId]: '1'});

        // For each post, delete post
        const posts = await redis.hGetAll(postListKey);
        for (const postId of Object.keys(posts)) {
            const post = await reddit.getPostById(postId as `t3_{string}`);
            if (post) {
                await post.remove(false);
                await post.addRemovalNote({ reasonId: '', modNote: `Survey Deleted by ${context.username}` });
            }
        }

        // Finally, schedule job
        await scheduler.runJob({
            name: Constants.DELETE_JOB_NAME,
            data: { surveyId },
            runAt: new Date()
        });

        return true;
    };

export const getQuestionById =
    async (surveyId: string, questionId: string): Promise<SurveyQuestionDto | null> => {
        // Create logger
        const logger = await Logger.Create('Dash Redis - Get Question');
        logger.traceStart('Start Fetch');

        try {
            // Get survey question config
            const questionsKey = RedisKeys.surveyQuestions(surveyId);
            const questionData = await redis.get(questionsKey);

            // Throw if not found
            if (!questionData) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`No survey found with ID: ${surveyId}`);
            }

            // Parse questions and find uestion with ID
            // PERF: Hindsight, maybe should store each question in a hash? Then order saved separately?
            const parsedQuestions = await Schema.surveyQuestionList.parseAsync(JSON.parse(questionData))
            const questionConfig = parsedQuestions
                ?.find(q => q.id == questionId);

            return questionConfig ? questionConfig satisfies SurveyQuestionDto : null;

        } catch (e) {

            logger.error(`Failed to get question with ID ${questionId}: `, e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };

export const getQuestionResponseById =
    async (surveyId: string, questionId: string): Promise<QuestionResponseDto> => {
        // Create logger
        const logger = await Logger.Create('Dash Redis - Get Question Response');
        logger.traceStart('Start Response Fetch');

        try {
            logger.debug(surveyId, questionId);

            // Fetch results for question
            const questionResultsKey = RedisKeys.surveyQuestionResults(surveyId, questionId);
            const responses = await redis.zCard(questionResultsKey);
            const ranks = responses > 0
                ? await redis.zRange(questionResultsKey, 0, responses)
                : [];
            logger.debug(responses, ranks);

            let total = 0;
            const mappedRanks = ranks.reduce((r: ResponseValuesDto, i: {member: string, score: number}) => {
                if (i.member == 'total') {
                    total = i.score;
                } else {
                    r[i.member] = i.score;
                }
                return r;
            }, {} as ResponseValuesDto);

            return {
                responses: mappedRanks,
                total: total
            } satisfies QuestionResponseDto;

        } catch (e) {

            logger.error(`Failed to get response for question ${questionId}: `, e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };

export const getSurveyResultSummary =
    async (surveyId: string): Promise<SurveyResultSummaryDto | null> => {
        // Create logger
        const logger = await Logger.Create('Dash Redis - Get Survey Result Summary');
        logger.traceStart('Start Response Fetch');

        try {
            logger.debug(surveyId);

            // First get survey config (with questions) to get all question IDs
            const config = await getSurveyById(surveyId, true);
            if (!config || !config.questions) {
                logger.warn(`Could not find a survey with ID: ${surveyId}`);
                return null;
            }

            // Fetch results for each question
            const responses = await Promise.all(
                config.questions.map(async (q) =>
                    [q.id, await getQuestionResponseById(surveyId, q.id)] as [string, QuestionResponseDto | null]
                )
            );

            // Reduce to a single object
            const resultList = responses.reduce((r: SurveyResultListDto, i: [string, QuestionResponseDto | null]) => {
                if (i[1])
                    r[i[0]] = i[1];
                return r;
            }, {} as SurveyResultListDto);

            return {
                survey: config,
                results: resultList
            } as SurveyResultSummaryDto;

        } catch (e) {

            logger.error(`Failed to get survey summary for ${surveyId}: `, e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };
