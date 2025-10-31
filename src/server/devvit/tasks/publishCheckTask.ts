/*!
 * Registers a route for the publish check scheduled cron.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../../PathFactory';
import { Router } from 'express';
import { Logger } from "../../util/Logger";
import { publishQueuedSurveys } from '../redis/dashboard';

export const registerPublishCheckTask: PathFactory = (router: Router) => {
    router.post('/internal/cron/publish-check', async (_req, res): Promise<void> => {
        const logger = await Logger.Create("Task - Publish Check");
        logger.traceStart("/internal/menu/publish-check");

        try {
            await publishQueuedSurveys();
            res.status(200).json({ status: 'ok' });

        } catch (error) {
            logger.error('Error processing publish check: ', error);
            res.status(500).json({
                status: 'error',
                message: 'Error processing publish check'
            });

        }

        logger.traceEnd();
    });
};
