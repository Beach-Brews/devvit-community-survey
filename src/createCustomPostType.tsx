/*!
 * An app that allows mods to post community multi-question surveys, and choose to show results to the community or not.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, useAsync, useWebView} from '@devvit/public-api';
import type {DevvitMessage, WebViewMessage} from './dwc/defs.js';
import {Redis} from "./data/Redis.js";
import {Logger} from "./utils/logging.js";
import {devvitOnMessage} from "./dwc/index.js";

const logger = Logger.CreateLogger('Survey');

// Add the custom post type to Devvit
Devvit.addCustomPostType({
    name: 'Community Survey',
    height: 'regular',
    render: (context) => {

        // Load configuration and response data
        const { data: initialData, loading: dataLoading, error: dataLoadError } = useAsync(
            async () => {
                const redis = new Redis(context.redis);
                return {
                    postConfig: await redis.getSurveyConfig(context.postId),
                    hasResponded: await redis.hasResponded(context),
                    responseCount: await redis.getResponseCount(context)
                };
            },
            {
                finally: (data, error) => {
                    if (data) return;
                    logger.error(context, `Failed to load survey configuration for post ${context.postId}: ${error}`);
                }
            });
        const postConfig = initialData?.postConfig;
        const hasResponded = initialData?.hasResponded ?? false;
        const responseCount = initialData?.responseCount ?? 0;

        // If the postConfig is currently null, display load or error
        if (!postConfig || dataLoading || dataLoadError) {
            return (
                <vstack grow padding="small">
                    <vstack grow alignment="middle center">
                        {!dataLoading || dataLoadError ? (
                                <vstack alignment="middle center">
                                    <icon name="warning" />
                                    <spacer size="small" />
                                    <text maxWidth="90%" wrap alignment="middle center">
                                        Sorry, there was an error loading the survey.
                                    </text>
                                    <button>Try again</button>
                                </vstack>
                            ) : (
                                <hstack alignment="start middle">
                                    <icon name="load" />
                                    <spacer size="small" />
                                    <text wrap>Survey Details Loading...</text>
                                </hstack>
                            )
                        }
                    </vstack>
                </vstack>
            );
        }

        // Load up webView
        const webView = useWebView<WebViewMessage, DevvitMessage>({
            url: 'page.html',
            onMessage: devvitOnMessage
        });

        // Setup helper variables
        const isLive = postConfig.status === 'live';
        const publishDate = postConfig.publishDate ? new Date(postConfig.publishDate+ 'z') : null;
        const isPublished = isLive && (
            publishDate == null ||
            new Date().getTime() > publishDate.getTime()
        );
        const closeDate = postConfig.closeDate ? new Date(postConfig.closeDate+ 'z') : null;
        const isClosed = (
            isPublished &&
            closeDate != null &&
            new Date().getTime() > closeDate.getTime()
        );

        // If owner, display different message
        if (postConfig.owner === context.userId) {

            // If not yet live, show message to configure
            if (!isPublished) {
                return (
                    <vstack grow padding="small">
                        <vstack grow alignment="middle center">
                            {!isLive
                                ? (
                                    <vstack alignment="middle center" width="100%">
                                        <icon name="warning"/>
                                        <spacer size="small"/>
                                        <text alignment="center middle" size="medium" wrap maxWidth="90%">
                                            Survey is in draft mode and is not visible to the public
                                        </text>
                                    </vstack>
                                ) : (
                                    <vstack alignment="middle center" width="100%">
                                        <icon name="hide"/>
                                        <spacer size="small"/>
                                        <text alignment="center middle" size="medium" wrap maxWidth="90%">
                                            Survey is scheduled to be published at:
                                        </text>
                                        <text alignment="center middle" size="medium" wrap maxWidth="90%">
                                            {publishDate?.toLocaleString() ?? ''}
                                        </text>
                                    </vstack>
                                )
                            }

                            <spacer size="large"/>
                            <button icon="customize">Configure Survey</button>
                        </vstack>
                    </vstack>
                );
            }

            // Otherwise, if the survey is published or closed
            return (
                <vstack grow padding="small">
                    <vstack grow alignment="middle center">
                        {!isClosed
                            ? (
                                <vstack alignment="middle center" width="100%">
                                    <icon name="show"/>
                                    <spacer size="small"/>
                                    <text alignment="center middle" size="medium" wrap maxWidth="90%">
                                        Survey is accepting responses!
                                    </text>
                                    {closeDate && (
                                        <text alignment="center middle" size="medium" wrap maxWidth="90%">
                                            Closes on {closeDate?.toLocaleString() ?? ''}
                                        </text>
                                    )}
                                </vstack>
                            ) : (
                                <vstack alignment="middle center" width="100%">
                                    <icon name="lock"/>
                                    <spacer size="small"/>
                                    <text alignment="center middle" size="medium" wrap maxWidth="90%">
                                        Survey closed at:
                                    </text>
                                    <text alignment="center middle" size="medium" wrap maxWidth="90%">
                                        {closeDate?.toLocaleString() ?? ''}
                                    </text>
                                </vstack>
                            )
                        }

                        <spacer size="large"/>
                        <button icon="dashboard">View Results</button>
                        <spacer size="small"/>
                        <text>{responseCount} responses</text>
                    </vstack>
                </vstack>
            );
        }

        // Render the custom post type
        return (
            <vstack grow padding="small">
                <vstack grow alignment="middle center">
                    <text size="xlarge" weight="bold">
                        {postConfig.title}
                    </text>
                    <spacer size="small"/>
                    <text alignment="middle center" wrap maxWidth="90%">
                        {postConfig.intro}
                    </text>
                    <spacer size="large"/>
                    {!isLive && (<button disabled>Check back soon. Survey is not live yet.</button>)}
                    {isLive && !isPublished && (<button disabled>Survey starts {publishDate?.toLocaleString() ?? ''}</button>)}
                    {isPublished && !isClosed && (postConfig.allowMultiple || !hasResponded) && (
                        <vstack>
                            <button icon="comment" onPress={() => webView.mount()}>
                                {hasResponded ? 'Start Another Response' : 'Start Survey'}
                            </button>
                            <spacer size="small" />
                            <text alignment="middle center" size="small">Closes at {closeDate?.toLocaleString() ?? ''}</text>
                        </vstack>
                    )}
                    {!isClosed && !postConfig.allowMultiple && hasResponded && (
                        <button icon="lock" disabled>You have already responded.</button>
                    )}
                    {isClosed && (<button icon="lock" disabled>Closed at {closeDate?.toLocaleString() ?? ''}</button>)}
                    {hasResponded && (
                        <vstack>
                            <spacer size="large" />
                            <button icon="delete">Delete Response</button>
                        </vstack>
                    )}
                </vstack>
            </vstack>
        );
    }
});