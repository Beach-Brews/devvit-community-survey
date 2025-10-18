/*!
 * Registers a route for creating the dashboard launcher.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../../PathFactory';
import { Router } from 'express';
import { context, reddit } from '@devvit/web/server';
import { Logger } from "../../util/Logger";
import { isMod } from '../../util/userUtils';
import { PostType } from '../../../shared/types/general';

export const registerCreateDashboardMenu: PathFactory = (router: Router) => {
    router.post('/internal/menu/create-dashboard', async (_req, res): Promise<void> => {
        const logger = await Logger.Create("Menu - Create Dashboard");
        logger.traceStart("/internal/menu/create-dashboard");

        try {
            // Confirm sub context set
            if (!context.subredditName) {
                // Yes, I know, bad practice, but also less duplicate code.
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Subreddit Name is required.');
            }

            // Confirm user is a moderator
            if (!(await isMod())) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('You must be a moderator.');
            }

            // Create the new Dashboard post
            const post = await reddit.submitCustomPost({
                splash: {
                    appDisplayName: 'Survey Dashboard',
                    heading: 'Survey Dashboard',
                    description: 'Create, edit and manage surveys',
                    buttonLabel: 'Launch Dashboard',
                    // TODO: entry: 'dashboard'
                    // TODO: backgroundUri: 'icon.png'
                    // TODO: appIconUri: ''
                },
                subredditName: context.subredditName,
                title: 'Survey Dashboard',
                postData: {
                    postType: PostType[PostType.Dashboard]
                },
                textFallback: {
                    text: 'Sorry, this app is not supported on Old Reddit.'
                }
            });

            // Immediately remove it from sub feed
            // TODO: How do I remove this, but also have it render?
            //await post.remove(false);

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
