/*!
 * Type definitions shared for the dashboard API.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

export type UserFlairTemplate = {
    id: string;
    text: string;
};

export type SubredditUserFlairsResult = {
    flairs: [UserFlairTemplate];
};
