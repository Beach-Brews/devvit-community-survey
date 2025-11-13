/*!
 * Helper method for checking for developer mode.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { context, settings } from '@devvit/web/server';

export const debugEnabled = async () => {
    return context?.userId === 't2_1a3euo740x' && ((await settings.get<boolean>("devConsole")) ?? false);
};
