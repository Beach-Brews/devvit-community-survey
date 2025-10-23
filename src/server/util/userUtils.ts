/*!
 * Various helper methods for user related actions.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {context, reddit, User} from "@devvit/web/server";

export const isMod = async (user?: User) => {
    user = user ?? await reddit.getCurrentUser();
    if (!user || !context.subredditName) return false;
    const modPermissions = await user.getModPermissionsForSubreddit(context.subredditName);
    return modPermissions.length > 0;
};
