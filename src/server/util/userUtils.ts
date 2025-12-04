/*!
 * Various helper methods for user related actions.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { context, reddit, User } from '@devvit/web/server';
import { ResponderCriteriaDto, SurveyDto } from '../../shared/redis/SurveyDto';
import { ResponseBlockedReason } from '../../shared/types/postApi';

export const isMod = async (user?: User): Promise<boolean> => {
    user = user ?? await reddit.getCurrentUser();
    if (!user || !context.subredditName) return false;
    const modPermissions = await user.getModPermissionsForSubreddit(context.subredditName);
    return modPermissions.some(p => p === 'all' || p === 'posts' || p === 'config');
};

export const isBanned = async (username?: string, subredditName?: string): Promise<boolean>  => {
    username = username ?? context.username;
    subredditName = subredditName ?? context.subredditName;
    if (!username || !subredditName) return false;
    const bannedUsers = await reddit.getBannedUsers({subredditName, username}).get(1);
    return bannedUsers.some(u => u.username === username);
};

export const isApproved = async (username?: string, subredditName?: string): Promise<boolean>  => {
    username = username ?? context.username;
    subredditName = subredditName ?? context.subredditName;
    if (!username || !subredditName) return false;
    const approvedUsers = await reddit.getApprovedUsers({subredditName, username}).get(1);
    return approvedUsers.some(u => u.username === username);
};

export const getResponseBlockedReason = async (survey: SurveyDto, user?: User): Promise<ResponseBlockedReason | undefined> => {

    // Get user if not specified
    user = user ?? await reddit.getCurrentUser();
    if (user === undefined)
        return ResponseBlockedReason.ANONYMOUS;

    // Fetch async info in parallel
    const [userIsBanned, userIsApproved, userSubKarma, userFlairs] = await Promise.all([
        isBanned(user.username),
        isApproved(user.username),
        user.getUserKarmaFromCurrentSubreddit(),
        user.getUserFlairBySubreddit(context.subredditName)
    ]);

    // If user is banned, return banned
    if (userIsBanned)
        return ResponseBlockedReason.BANNED;

    // Get settings object
    const criteria = survey.responderCriteria ?? {
        verifiedEmail: false,
        approvedUsers: false,
        minKarma: null,
        minSubKarma: null,
        userFlairs: null
    } satisfies ResponderCriteriaDto;

    // Check user has verified email
    if (criteria.verifiedEmail && !user.hasVerifiedEmail)
        return ResponseBlockedReason.NOT_VERIFIED;

    // Check user is an approved user
    if (criteria.approvedUsers && !userIsApproved)
        return ResponseBlockedReason.NOT_APPROVED;

    // Check user has minimum karma
    if (criteria.minKarma !== null && (user.commentKarma + user.linkKarma) < criteria.minKarma)
        return ResponseBlockedReason.MIN_KARMA;

    if (criteria.minSubKarma !== null && ((userSubKarma.fromComments ?? 0) + (userSubKarma.fromPosts ?? 0)) < criteria.minSubKarma)
        return ResponseBlockedReason.MIN_SUB_KARMA;

    // Check user flair
    const userFlairMatch = !criteria.userFlairs || criteria.userFlairs.length <= 0 ||
        (userFlairs !== undefined && criteria.userFlairs.some(f => !!userFlairs.flairText?.match(f)));
    if (!userFlairMatch)
        return ResponseBlockedReason.USER_FLAIR;

    // Otherwise, there is no reason
    return undefined;
}
