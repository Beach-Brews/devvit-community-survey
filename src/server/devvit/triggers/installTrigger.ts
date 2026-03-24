/*!
 * Registers a route for handling app install triggers.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { PathFactory } from '../../PathFactory';
import { Router } from 'express';
import { Logger } from '../../util/Logger';
import { context, reddit } from '@devvit/web/server';
import { Constants } from '../../../shared/constants';

export const registerAppInstallTrigger: PathFactory = (router: Router) => {
    router.post('/internal/trigger/on-install', async (_req, res): Promise<void> => {
        const logger = await Logger.Create("Trigger - App Install");
        logger.traceStart("/internal/trigger/on-install");

        try {

            // Send modmail about tutorials and getting started
            await reddit.modMail.createModInboxConversation({
                subject: 'CommunitySurvey Quick Start Guide',
                bodyMarkdown: `Hi mods of r/${context.subredditName},

Thank you for installing CommunitySurvey!

Below is a quick guide on creating your first survey. Additional help and support can be found in the r/CommunitySurvey
[Getting Started Wiki Page](https://www.reddit.com/r/CommunitySurvey/wiki/app/gerring-started/).

**Getting Started**

1. Navigate to r/${context.subredditName} and click on the three dot menu in the right corner.
2. Click on "Create Survey Dashboard".
3. A new dashboard post is created. Mods use this to create surveys, but users will only see a list of surveys (none initially).
4. Click on "Launch Dashboard". You can only see your created surveys, not the surveys of your co-mods. A future release will allow collaborative editing!
5. Click the "Add" button to create a new survey.
6. At the top you can set the survey title, description, responder criteria, result visibility, etc.
7. Add up to ${Constants.MAX_QUESTION_COUNT} questions, with up to ${Constants.MAX_OPTION_COUNT} options each.
8. At the bottom you can edit the outro text shown to users when they have completed the survey.
9. Click the "Publish" button and set the publish date and/or close date of your survey.
10. Click the "Publish Now/Later" button.

Done!

A new survey post will be created on the publish date, and users will be able to respond to your first survey!

Enjoy,  
u/Beach-Brews
`,
                subredditId: context.subredditId,
            });

            res.status(200).json({ status: 'ok' });

        } catch (error) {
            logger.error('Error processing app install trigger: ', error);
            res.status(500).json({
                status: 'error',
                message: 'Error processing app install trigger'
            });

        }

        logger.traceEnd();
    });
};
