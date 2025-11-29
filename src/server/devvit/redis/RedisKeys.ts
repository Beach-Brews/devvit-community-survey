/*!
 * Helper for keeping Redis keys consistent.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { assertSurveyId, assertUserId, assertQuestionId, assertResponseId } from '../../../shared/redis/uuidGenerator';

export const RedisKeys = {
    /**
     * Saves the ID of the dashboard post, so multiple are not created.
     *
     * **Type:** Hash Set (hSet)
     *
     * **Field:** PostId - The Post ID last saved for the dash post
     *
     * **Value:** Time - The time the last request to create a dashboard was. Allows forcing a new post if create menu
     *                   is used in the same minute.
     *
     * **Actions:**
     * - Get Existing ID - Check if existing post exists
     * - Save New ID - Save ID of new dashboard post
     */
    dashboardPostId: () => `dash:id`,

    /**
     * List of all survey authors. Used to check for account deletion.
     *
     * **Type:** Sorted Set (ZSet)
     *
     * **Members:** UserId - The userId for the author
     *
     * **Score:** The last time the user has performed an action, or last delete check
     *
     * **Actions:**
     * - Survey Create - Update action time
     * - Survey Edit - Update action time
     * - Survey Delete - Remove from set (if no more surveys authored)
     * - Account Delete - Delete all authored surveys will remove user from set.
     */
    authorList: () => `usr:author`,

    /**
     * List of surveys by a specific author
     *
     * **Type:** Hash Set (hSet)
     *
     * **Field:** SurveyId - The ID of each survey
     *
     * **Value:** Always hard-coded to a 1
     *
     * **Actions:**
     * - Survey Create - Increase survey count
     * - Survey Delete - Decrease survey count (or remove member if 0)
     * - Account Delete - Survey is deleted. See Survey Delete action.
     *
     * @param userId - The user's ID
     */
    authorSurveyList: (userId: string) => {
        assertUserId(userId);
        return `usr:${userId}:svs`;
    },

    /**
     * Holds configuration for a survey.
     *
     * **Type:** String
     *
     * **Value:** A survey DTO as a JSON Stringified object
     *
     * **Actions:**
     * - Survey Create - Save config
     * - Survey Get - Get a config
     * - Survey Close - Set a close date on a survey that did not have one scheduled
     * - Survey Delete - Delete config
     * - Account Delete - Survey is deleted. See Survey Delete action.
     *
     * @param surveyId
     */
    surveyConfig: (surveyId: string) => {
        assertSurveyId(surveyId);
        return `sv:${surveyId}:conf`;
    },

    /**
     * Holds the question configuration for a survey.
     *
     * **Type:** String
     *
     * **Value:** An array of survey question DTOs as a JSON Stringified array
     *
     * **Actions:**
     * - Survey Create - Save config
     * - Survey Get - Get a config
     * - Survey Delete - Delete config
     * - Account Delete - Survey is deleted. See Survey Delete action.
     *
     * @param surveyId
     */
    surveyQuestions: (surveyId: string) => {
        assertSurveyId(surveyId);
        return `sv:${surveyId}:qns`;
    },

    /**
     * Holds the post ID(s) for surveys.
     *
     * **Type:** Hash Set (hSet)
     *
     * **Field:** PostId - The post ID
     *
     * **Value:** Always hard-coded to a 1
     *
     * **Actions:**
     * - Survey Publish - Save the post ID.
     * - Survey Delete - Delete post.
     * - Account Delete - Survey is deleted. See Survey Delete action.
     *
     * @param surveyId
     */
    surveyPostList: (surveyId: string) => {
        assertSurveyId(surveyId);
        return `sv:${surveyId}:posts`;
    },

    /**
     * Holds the IDs of surveys that have been scheduled for future publishing, and the timestamp to publish at.
     *
     * **Type:** Hash Set (hSet)
     *
     * **Field:** SurveyId - The survey ID being published
     *
     * **Value:** The Unix timestamp to publish the survey at
     *
     * **Actions:**
     * - Survey Save - Add to publish queue if publish date is given
     * - Publish Check - Get surveys queued for publish
     * - Survey Published - Remove survey from publish queue
     * - Survey Delete - Delete survey from queue if needed
     * - Account Delete - Survey is deleted. See Survey Delete action.
     */
    surveyPublishQueue: () => `sv:pub`,

    /**
     * Holds the IDs of surveys that have been queued for deletion.
     *
     * **Type:** Hash Set (hSet)
     *
     * **Field:** SurveyId - The survey ID being published
     *
     * **Value:** Always hard-coded to a 1
     *
     * **Actions:**
     * - Process Queue - Get surveys queued for delete
     * - Get Survey - Determine if survey is queued for delete or not
     * - Survey Delete - Delete survey from queue after deleted
     * - Account Delete - Survey is deleted. See Survey Delete action.
     */
    surveyDeleteQueue: () => `sv:del`,

    /* ======================================= */
    /* ============== Responses ============== */
    /* ======================================= */

    /**
     * Holds the aggregated numeric values for responses.
     *
     * **Type:** Sorted Set (zSet)
     *
     * **Member:** OptionId | OptionValue | 'total'
     *
     * **Score:** See note below
     *
     * **Scores Based on Member:** Scoring depends on member type
     * - Total - For the special 'total' member, the score is the total number of responses provided.
     * - Multiple/Checkbox/Rank - The member is the Option ID and the score is the number of responses for that option.
     * - Scale - The member is the scale value (e.g. 4) and the score is the number of responses for that scale value.
     *
     * **Actions:**
     * - Add Response - Add user to response list
     * - Deletes Responses - Decrease response count (or remove from set)
     * - Survey Delete - Same as deleting responses.
     * - Delete Account - Same as deleting responses.
     *
     * @param surveyId
     * @param questionId
     */
    surveyQuestionResults: (surveyId: string, questionId: string) => {
        assertSurveyId(surveyId);
        assertQuestionId(questionId);
        return `sv:${surveyId}:qn:${questionId}`;
    },

    /**
     * Holds the IDs of all users who have responded to a survey. Used for checking for deleted accounts.
     *
     * **Type:** Sorted Set (zSet)
     *
     * **Member:** UserId - The User ID
     *
     * **Score:** The last time the user has performed an action, or last delete check
     *
     * **Actions:**
     * - Add Response - Set timestamp
     * - Deletes Response - Remove user from set (if no more responses)
     * - Deletes All Responses to Survey - Remove user from set (if no more responses)
     * - Survey Delete - Remove user from set (if no more responses)
     * - Delete Account - Delete all responses for all surveys, which will remove from set
     */
    responderList: () => `usr:resp`,

    /**
     * Holds the IDs of all surveys a user has responded to. Aids in efficient account deletion, or a future "dashboard"
     * view for getting responses from a specific user, or for users to manage their survey responses.
     *
     * **Type:** Hash Set (hSet)
     *
     * **Field:** SurveyId - The Survey ID the used has responded to
     *
     * **Value:** Always hard-coded to 1
     *
     * **Actions:**
     * - Add Response - Add survey to set
     * - Deletes Response - Remove from set if all responses deleted (when removed from surveyResponderList)
     * - Deletes All Responses to Survey - Remove survey from set
     * - Survey Delete - Delete survey from set
     * - Delete Account - Delete set
     *
     * @param userId
     */
    responderSurveyList: (userId: string) => {
        assertUserId(userId);
        return `usr:${userId}:sv`;
    },

    /**
     * Holds the IDs of all users who have responded to a specific survey, along with the total response count.
     *
     * **Type:** Sorted Set (zSet)
     *
     * **Member:** UserId | 'total' - The User ID of a responder, or a special 'total' member
     *
     * **Score:** The number of responses from the user to a specific survey, or the total responses to the survey
     *
     * **Actions:**
     * - Add Response - Increase user score by 1, increase 'total' by 1
     * - Get Response Count - Return score of 'total' member
     * - Deletes Response - Decrease user response count (or remove from set), decrease total by 1
     * - Deletes All Responses - Remove user from set, decrease total by user's score
     * - Survey Delete - Delete set
     * - Delete Account - Same as deleting survey
     *
     * @param surveyId
     */
    surveyResponderList: (surveyId: string) => {
        assertSurveyId(surveyId);
        return `sv:${surveyId}:usr`;
    },

    /**
     * Holds the IDs of all responses of a specific user to a specific survey.
     *
     * **Type:** Sorted Set (zSet)
     *
     * **Member:** ResponseId - The unique response ID.
     *
     * **Score:** The timestamp the survey response was first created.
     *
     * **Actions:**
     * - Add Response - Add response ID to list.
     * - Get Latest Response - Get response with the largest score
     * - Deletes Response - Remove member for deleted response
     * - Deletes All Responses - Delete set
     * - Survey Delete - Same as deleting all responses
     * - Delete Account - Same as deleting survey
     *
     * @param userId
     * @param surveyId
     */
    responderSurveyResponseList: (userId: string, surveyId: string) => {
        assertUserId(userId);
        assertSurveyId(surveyId);
        return `usr:${userId}:sv:${surveyId}:resp`;
    },

    /**
     * Holds the IDs of all surveys a user has responded to. Aids in efficient account deletion, or a future "dashboard"
     * view for getting responses from a specific user, or for users to manage their survey responses.
     *
     * **Type:** Hash Set (hSet)
     *
     * **Field:** QuestionId - The Question ID the response is for
     *
     * **Value:** A stringified array
     * - Multi/Check/Rank - An array of options selected by the user
     * - Scale - An array with a single scale value chosen by the user
     *
     * **Actions:**
     * - Add Response - Add value to set
     * - Get Response - Return data
     * - Deletes Response - Delete set
     * - Deletes All Responses to Survey - Delete set
     * - Survey Delete - Delete set
     * - Delete Account - Delete set
     *
     * @param userId
     * @param surveyId
     * @param responseId
     */
    responderSurveyResponse: (userId: string, surveyId: string, responseId: string) => {
        assertUserId(userId);
        assertSurveyId(surveyId);
        assertResponseId(responseId);
        return `usr:${userId}:sv:${surveyId}:sr:${responseId}`;
    }
};
