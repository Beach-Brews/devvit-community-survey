/*!
 * Utility to publish a new survey to the sub feed.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { context, reddit, Post } from '@devvit/web/server';
import { SurveyDto } from '../../shared/redis/SurveyDto';
import { PostType } from '../../shared/types/general';

export const createSurveyPost = async (survey: SurveyDto): Promise<Post> => {
    // Create the new survey post
    return await reddit.submitCustomPost({
        subredditName: context.subredditName,
        title: survey.title,
        postData: {
            postType: PostType[PostType.Survey],
            surveyId: survey.id
        },
        textFallback: {
            text: 'Sorry, this survey is not supported on Old Reddit or has been deleted.'
        },
        entry: "default"
    });
};
