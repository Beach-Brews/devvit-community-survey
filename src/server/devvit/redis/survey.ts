/*!
 * Helper for accessing and saving Redis keys for actions responding to surveys.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

// Export method from dashboard
export { getSurveyById } from './dashboard';

const RedisKeys = {
    userResponse: () => ``
};

export const addResponse =
    async (): Promise<void> => {
        // TODO:
        console.log(RedisKeys.userResponse());
    };
