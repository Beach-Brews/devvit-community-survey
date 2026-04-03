/*!
 * Registers all paths for the hub front-end.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { ApiResponse } from '../../shared/types/api';
import { Logger } from '../util/Logger';
import { messageResponse, successResponse } from '../util/apiUtils';
import * as hubRedis from '../devvit/redis/hub';
import { reddit } from '@devvit/web/server';
import { InitializeHubResponse, InitializeSurveyResponse } from '../../shared/types/postApi';
import { isMod } from '../util/userUtils';
import { debugEnabled } from '../util/debugUtils';

export const registerHubRoutes: PathFactory = (router: Router) => {
    router.route('/api/hub/init')
    .get<void, ApiResponse<InitializeSurveyResponse>>(async (_req, res) => {
        const logger = await Logger.Create(`Hub API - Init`);
        logger.traceStart('Api Start');

        try {
            // Get survey list and user info
            const [surveys, userInfo, currentSub] = await Promise.all([
                hubRedis.getHubSurveys(),
                reddit.getCurrentUser(),
                reddit.getCurrentSubreddit()
            ]);
            const [userIsMod, snoovar] = userInfo
                ? await Promise.all([
                    isMod(userInfo),
                    userInfo.getSnoovatarUrl()
                ])
                : [false, undefined];

            successResponse(res, {
                surveys: surveys,
                user: {
                    isMod: userIsMod,
                    responseBlocked: null,
                    allowDev: await debugEnabled(),
                    username: userInfo?.username ?? 'anonymous',
                    userId: userInfo?.id,
                    snoovar: snoovar
                },
                subInfo: {
                    name: currentSub.name,
                    icon: currentSub.settings.communityIcon
                }
            } satisfies InitializeHubResponse);

        } catch (e) {
            logger.error('Error executing API: ', e);
            messageResponse(res, 500, 'There was an error processing this request');
        } finally {
            logger.traceEnd();
        }
    });
};
