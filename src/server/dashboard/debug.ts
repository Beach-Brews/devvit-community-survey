/*!
 * Registers all paths for the dashboard debug view. Might be removed in the future. Mostly for development.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../PathFactory';
import { Router } from 'express';
import { ApiResponse } from '../../shared/types/api';
import {
    errorIfNotMod,
    messageResponse,
    successResponse,
} from '../util/apiUtils';
import { Logger } from '../util/Logger';
import { redis } from '@devvit/web/server';

type KeyDebugDto = {
    key?: string | undefined;
    type?: 'get' | 'hGetAll' | 'zScan' | 'del' | 'hDel' | 'zRem' | undefined;
    cursor?: number | undefined;
}

export const registerDashboardDebugRoutes: PathFactory = (router: Router) => {

    router.post<void, ApiResponse<[string, string]>, string>(
        "/api/debug/key",
        async (req, res) => {
            const logger = await Logger.Create('Debug API - User Details');
            logger.traceStart('Api Start');

            try {
                if (await errorIfNotMod(res)) return;

                const keyInfo = JSON.parse(req.body) as KeyDebugDto;
                if (!keyInfo || !keyInfo.key || !keyInfo.type) {
                    return messageResponse(res, 400, 'Missing key or type');
                }

                let val: string | undefined = undefined;
                switch (keyInfo.type) {
                    case 'get':
                        val = await redis.get(keyInfo.key);
                        break;

                    case 'hGetAll':
                        val = JSON.stringify(await redis.hGetAll(keyInfo.key), null, 2);
                        break;

                    case 'zScan': {
                            const cursor: number = (!keyInfo.cursor || isNaN(keyInfo.cursor))
                                ? 0
                                : keyInfo.cursor
                            ?? 0;
                            val = JSON.stringify(await redis.zScan(keyInfo.key, cursor), null, 2);
                            break;
                        }
                }
                return successResponse(res, { key: keyInfo.key, type: keyInfo.type, value: val });

            } catch(e) {
                logger.error('Error executing API: ', e);
                messageResponse(res, 500, 'There was an error processing this request');
            } finally {
                logger.traceEnd();
            }
        }
    );

};
