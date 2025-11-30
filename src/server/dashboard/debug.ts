/*!
 * Registers all paths for the dashboard debug view. Might be removed in the future. Mostly for development.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { Logger } from '../util/Logger';
import { redis } from '@devvit/web/server';
import { debugEnabled } from '../util/debugUtils';

type KeyDebugRequestDto = {
    key?: string | undefined;
    action?: 'get' | undefined;
    cursor?: number | undefined;
}

type KeyDebugResponseDto = {
    type: 'string' | 'hash' | 'zset' | 'error';
    key?: string | undefined;
    data?: string | { [prop: string]: string } | {score: number, member: string}[] | undefined;
    cursor?: number | undefined;
    error?: string | undefined;
};

export const registerDashboardDebugRoutes: PathFactory = (router: Router) => {

    router.post<void, KeyDebugResponseDto, string>(
        "/api/debug/key",
        async (req, res) => {
            const logger = await Logger.Create('Debug API - Action on Key');
            logger.traceStart('Api Start');

            try {
                if (!(await debugEnabled())) {
                    res.status(403).json({
                        type: 'error',
                        error: 'The debug console setting is off'
                    });
                    return;
                }

                const keyInfo = JSON.parse(req.body) as KeyDebugRequestDto;
                if (!keyInfo || !keyInfo.key || !keyInfo.action) {
                    res.status(400).json({
                        type: 'error',
                        error: 'A key was or action type was not specified'
                    });
                    return;
                }

                // Get key type
                const response = {
                    key: keyInfo.key,
                    type: await redis.type(keyInfo.key)
                } as KeyDebugResponseDto;

                // Fetch based on key type
                switch (response.type) {
                    case 'string':
                        response.data = await redis.get(keyInfo.key);
                        break;

                    case 'hash':
                        response.data = await redis.hGetAll(keyInfo.key);
                        break;

                    case 'zset': {
                        const cursor: number = (!keyInfo.cursor || isNaN(keyInfo.cursor))
                            ? 0
                            : keyInfo.cursor
                        ?? 0;
                        const zResult = await redis.zScan(keyInfo.key, cursor);
                        response.cursor = zResult.cursor;
                        response.data = zResult.members;
                        break;
                    }
                }

                res.status(200).json(response);

            } catch(e) {
                logger.error('Error executing API: ', e);
                res.status(500).json({
                    type: 'error',
                    error: 'An unknown error occurred.'
                });
            } finally {
                logger.traceEnd();
            }
        }
    );

};
