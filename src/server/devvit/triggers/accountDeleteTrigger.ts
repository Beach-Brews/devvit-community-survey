/*!
 * Registers a route for handling account delete triggers.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../../PathFactory';
import { Router } from 'express';
import { Logger } from "../../util/Logger";

export const registerAccountDeleteTrigger: PathFactory = (router: Router) => {
    router.post('/internal/trigger/account-delete', async (req, res): Promise<void> => {
        const logger = await Logger.Create("Trigger - Account Delete");
        logger.traceStart("/internal/trigger/account-delete");

        try {
            const userId = req.body?.userId as string | undefined;
            if (!userId) {
                // noinspection ExceptionCaughtLocallyJS
                throw new Error(`Failed to get userId from request: ${req.body}`);
            }

            // Loop over all surveys
            // If user created the survey, queue for delete
            // Otherwise, check if user has a response. Delete response.

            res.status(200).json({ status: 'ok' });

        } catch (error) {
            logger.error('Error processing account delete trigger: ', error);
            res.status(500).json({
                status: 'error',
                message: 'Error processing account delete trigger'
            });

        }

        logger.traceEnd();
    });
};

