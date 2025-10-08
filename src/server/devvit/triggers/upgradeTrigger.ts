/*!
 * Registers a route for handling app upgrade triggers.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../../PathFactory';
import { Router } from 'express';
import { Logger } from "../../util/Logger";

export const registerAppUpgradeTrigger: PathFactory = (router: Router) => {
    router.post('/internal/trigger/on-upgrade', async (_req, res): Promise<void> => {
        const logger = await Logger.Create("Trigger - App Upgrade");
        logger.traceStart("/internal/trigger/on-upgrade");

        try {

            res.status(200).json({ status: 'ok' });

        } catch (error) {
            logger.error('Error processing app upgrade trigger: ', error);
            res.status(500).json({
                status: 'error',
                message: 'Error processing app upgrade trigger'
            });

        }

        logger.traceEnd();
    });
};
