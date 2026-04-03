/*!
 * Helper for accessing and saving Redis keys for actions responding to the survey hub.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { Logger } from '../../util/Logger';
import { redis } from '@devvit/web/server';
import { RedisKeys } from './RedisKeys';
import { SurveyDto } from '../../../shared/redis/SurveyDto';
import * as dashRedis from './dashboard';

export const getHubSurveys = async (): Promise<SurveyDto[]> => {

        // Create logger
        const logger = await Logger.Create('Hub Redis - Get Surveys');
        logger.traceStart('Start Fetch');

        try {

            // TODO: Migrate postId set for performance
            // Get all surveys with a postId
            // Get survey configs for each
            // Sort by publish date

            // Get author list
            const authors = await redis.zScan(RedisKeys.authorList(), 0, undefined, 100);

            // Get surveys for each author
            const surveys: SurveyDto[] = [];
            for (const author of authors.members.map(m => m.member)) {
                try {
                    surveys.push(...(await dashRedis.getSurveyListForAuthor(author)));
                } catch (_) {
                    // Ignore any errors
                }
            }

            // Filter non-published surveys
            const now = Date.now();
            return surveys
                .filter(s => s.publishDate !== null && s.publishDate < now)
                .sort((a, b) => (a.publishDate ?? 0) - (b.publishDate ?? 0));

        } catch (e) {

            logger.error('Failed to fetch hub list: ', e);
            throw e;

        } finally {
            logger.traceEnd();
        }
    };
