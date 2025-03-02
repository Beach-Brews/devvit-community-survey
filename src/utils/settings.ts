/*!
 * Helper for getting settings.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Context} from "@devvit/public-api";

export enum SettingsKey {
    DebugLevel = 'debug-level'
}

export const getSetting =
    async <T>(ctx: Context, key: SettingsKey): Promise<T | undefined> => {
        return await ctx.settings.get<T>(key);
    }