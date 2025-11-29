/*!
 * Registers a route for creating the dashboard launcher.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../../PathFactory';
import { Router } from 'express';
import { context, reddit, redis } from '@devvit/web/server';
import { Logger } from "../../util/Logger";
import { isMod } from '../../util/userUtils';
import { PostType } from '../../../shared/types/general';
import { RedisKeys } from '../redis/RedisKeys';

export const registerCreateDashboardMenu: PathFactory = (router: Router) => {
    router.post('/internal/menu/create-dashboard', async (_req, res): Promise<void> => {
        const logger = await Logger.Create("Menu - Create Dashboard");
        logger.traceStart("/internal/menu/create-dashboard");

        try {
            // Confirm sub context set
            if (!context.subredditName) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Subreddit Name is required.');
            }

            // Confirm user is a moderator
            if (!(await isMod())) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('You must be a moderator.');
            }

            // Check if there is an existing post ID saved
            const dashPostKey = RedisKeys.dashboardPostId();
            const postIdSet = Object.entries(await redis.hGetAll(dashPostKey));
            if (postIdSet?.[0]?.[0] !== undefined) {

                // Check time for "forced" new dashboard post
                const parsedTime = parseInt(postIdSet[0][1]);
                if (isNaN(parsedTime) || parsedTime < Date.now() - 60000) {

                    // Check if the post actually exists
                    const existingPost = await reddit.getPostById(postIdSet[0][0] as `t3_${string}`);
                    if (existingPost) {

                        // Update the last request time (fallback)
                        await redis.hSet(dashPostKey, { [existingPost.id]: Date.now().toString() });

                        // And redirect the user
                        res.json({
                            navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${existingPost.id}`,
                        });
                        return;
                    }
                }
            }

            // Create the new Dashboard post
            const post = await reddit.submitCustomPost({
                subredditName: context.subredditName,
                title: 'Community Survey - Dashboard',
                postData: {
                    postType: PostType[PostType.Dashboard]
                },
                textFallback: {
                    text: 'Sorry, this app is not supported on Old Reddit.'
                },
                entry: 'dashboard'
            });

            // Immediately remove it from sub feed
            // TODO: Either wait for Reddit to allow interactive views on removed posts, or menu item webviews
            //await post.remove(false);

            // Save the ID to Redis (reset if force-created)
            await redis.del(dashPostKey);
            await redis.hSet(dashPostKey, { [post.id]: Date.now().toString() });

            res.json({
                navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
            });

        } catch (error) {
            logger.error('Error creating post: ', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to create post'
            });

        }

        logger.traceEnd();
    });
};
