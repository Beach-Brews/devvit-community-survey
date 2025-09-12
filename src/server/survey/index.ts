/*!
 * Registers all paths for the survey front-end.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { DecrementResponse, IncrementResponse, InitResponse } from '../../shared/types/api';
import { context, reddit, redis } from '@devvit/web/server';

export const registerSurveyRoutes: PathFactory = (router: Router) => {

    router.get<{ postId: string }, InitResponse | { status: string; message: string }>(
        '/api/init',
        async (_req, res): Promise<void> => {
            const { postId } = context;

            if (!postId) {
                console.error('API Init Error: postId not found in devvit context');
                res.status(400).json({
                    status: 'error',
                    message: 'postId is required but missing from context',
                });
                return;
            }

            try {
                const [count, username] = await Promise.all([
                    redis.get('count'),
                    reddit.getCurrentUsername(),
                ]);

                res.json({
                    type: 'init',
                    postId: postId,
                    count: count ? parseInt(count) : 0,
                    username: username ?? 'anonymous',
                });
            } catch (error) {
                console.error(`API Init Error for post ${postId}:`, error);
                let errorMessage = 'Unknown error during initialization';
                if (error instanceof Error) {
                    errorMessage = `Initialization failed: ${error.message}`;
                }
                res.status(400).json({ status: 'error', message: errorMessage });
            }
        }
    );

    router.post<{ postId: string }, IncrementResponse | { status: string; message: string }, unknown>(
        '/api/increment',
        async (_req, res): Promise<void> => {
            const { postId } = context;
            if (!postId) {
                res.status(400).json({
                    status: 'error',
                    message: 'postId is required',
                });
                return;
            }

            res.json({
                count: await redis.incrBy('count', 1),
                postId,
                type: 'increment',
            });
        }
    );

    router.post<{ postId: string }, DecrementResponse | { status: string; message: string }, unknown>(
        '/api/decrement',
        async (_req, res): Promise<void> => {
            const { postId } = context;
            if (!postId) {
                res.status(400).json({
                    status: 'error',
                    message: 'postId is required',
                });
                return;
            }

            res.json({
                count: await redis.incrBy('count', -1),
                postId,
                type: 'decrement',
            });
        }
    );
};
