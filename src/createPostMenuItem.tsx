/*!
 * Adds a menu item for moderators to create new survey posts.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from '@devvit/public-api';
import {Schema, SurveyConfig, SurveyQuestionList} from "./data/Schema.js";
import {Logger} from "./utils/logging.js";
import {Redis} from "./data/Redis.js";

const logger = Logger.CreateLogger('CreatePost');

// Define a form that collects the post title and optional config import
const createPostMenuItem = Devvit.createForm((_) =>
    {
        const oneWeek = new Date((new Date().getTime()) + (86400000 * 7));
        const endPlaceholder = `${oneWeek.getUTCFullYear()}/${oneWeek.getUTCMonth()+1}/${oneWeek.getUTCDate()}} ${oneWeek.getUTCHours()}:${oneWeek.getUTCMinutes()}`;
        return {
            title: 'Create New Survey',
            fields: [
                {
                    name: 'title',
                    label: 'Post Title',
                    type: 'string',
                    required: true,
                    defaultValue: 'Community Feedback Survey',
                },
                {
                    name: 'intro',
                    label: 'Intro Summary',
                    type: 'string',
                    required: true,
                    defaultValue: 'We want your feedback!',
                    helpText: 'Displays as a summary before starting the survey.'
                },
                {
                    name: 'closeDate',
                    label: 'Closing Date UTC',
                    type: 'string',
                    required: false,
                    placeholder: endPlaceholder,
                    helpText: 'Optional close date of survey. Must be UTC. Placeholder is 7 days.'
                },
                {
                    name: 'allowMultiple',
                    label: 'Allow Multiple Submissions',
                    type: 'boolean',
                    helpText: 'Whether to allow multiple submissions.',
                    defaultValue: false
                },
                {
                    name: 'config',
                    label: 'Survey Import',
                    type: 'paragraph',
                    required: false,
                    helpText: 'Paste a survey configuration from a previously built survey.'
                },
                {
                    name: 'publish',
                    label: 'Publish Now',
                    type: 'boolean',
                    helpText: 'If importing a survey configuration, whether to publish immediately or not.',
                    defaultValue: false
                }
            ],
            acceptLabel: 'Create'
        }
    },

    // On submit of the create form, post the new survey
    async ({values}, context) => {

        // If the subreddit name is missing from the context, abort
        if (!context.subredditName) {
            context.ui.showToast({appearance: 'neutral', text: 'Error: Subreddit context missing'});
            return;
        }

        // If the subreddit name is missing from the context, abort
        if (!context.userId) {
            context.ui.showToast({appearance: 'neutral', text: 'Error: Current user context missing'});
            return;
        }

        // If importing a config, confirm it is valid
        let parsedQuestions: SurveyQuestionList | undefined = undefined;
        const importText = values.config;
        const importing = importText && importText.length > 0;
        if (importing) {

            // Try and parse from schema
            // TODO: May want to provide as a CSV format instead/also?
            //       Type,Required,Title,Description,Args1,Args2
            //       text,no,Testing,This is a test,10,0
            //       multi,yes,Testing,This is a test,My Option:option1;Another Option:value2
            try {
                parsedQuestions = await Schema.surveyQuestionList.parseAsync(importText);

            } catch (e) {
                // Stop post if provided config is invalid
                logger.error(context, e, 'Invalid survey configuration provided');
                context.ui.showToast({appearance: 'neutral', text: 'Error: Invalid survey configuration provided for import.'});
                return;
            }
        }

        // Confirm close date is valid
        let closeDate: Date | null = null;
        if (values.closeDate  && values.closeDate.length > 0) {
            // Create date from string (force UTC)
            closeDate = new Date(values.closeDate + 'z');

            // Stop post if provided date is invalid
            if (isNaN(closeDate.getTime())) {
                logger.error(context, 'Invalid close date format provided: ' + values.closeDate);
                context.ui.showToast({
                    appearance: 'neutral',
                    text: 'Error: Invalid close date format provided: ' + values.closeDate
                });
                return;
            }
        }

        // Define config
        const surveyConfig = {
            owner: context.userId,
            title: values.title,
            intro: values.intro,
            closeDate: closeDate
                ? closeDate.toISOString()
                : null,
            allowMultiple: values.allowMultiple,
            publishDate: importing && values.publish
                ? new Date().toISOString()
                : null,
            status: importing && values.publish ? 'live' : 'draft',
            questions: importing && parsedQuestions ? parsedQuestions : []
        } satisfies SurveyConfig;

        // Submit the new post
        const post = await context.reddit.submitPost({
            title: values.title,
            subredditName: context.subredditName,
            textFallback: {
                text: 'Interactive posts are unsupported on old.reddit or older app versions.'
            },
            // TODO: Change loading text with animated GIF?
            preview: (
                <vstack grow padding="small">
                    <vstack grow alignment="middle center">
                        <hstack alignment="start middle">
                            <icon name="load" />
                            <spacer size="small" />
                            <text wrap>Survey Details Loading...</text>
                        </hstack>
                    </vstack>
                </vstack>
            ),
        });

        // Save info to Redis!
        await new Redis(context.redis).setSurveyConfig(post.id, surveyConfig);

        // Show a success toaster and navigate to the new post
        context.ui.showToast({appearance: 'success', text: 'Created new survey!'});
        context.ui.navigateTo(post);
    }
);

// Create a mod-only menu item to create the survey post
Devvit.addMenuItem({
    label: 'Community Survey - New Survey',
    location: 'subreddit',
    forUserType: 'moderator',
    onPress: async (_event, context) => {
        context.ui.showForm(createPostMenuItem);
    },
});