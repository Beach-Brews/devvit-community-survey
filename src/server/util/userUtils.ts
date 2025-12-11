/*!
 * Various helper methods for user related actions.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { context, reddit, User } from '@devvit/web/server';
import { DefaultResponderCriteria, FlairType, KarmaType, SurveyDto } from '../../shared/redis/SurveyDto';
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

export const isMuted = async (username?: string, subredditName?: string): Promise<boolean>  => {
    username = username ?? context.username;
    subredditName = subredditName ?? context.subredditName;
    if (!username || !subredditName) return false;
    const approvedUsers = await reddit.getMutedUsers({subredditName, username}).get(1);
    return approvedUsers.some(u => u.username === username);
};

export const getResponseBlockedReason = async (survey: SurveyDto, user?: User): Promise<ResponseBlockedReason | undefined> => {

    // Get user if not specified
    user = user ?? await reddit.getCurrentUser();
    if (user === undefined)
        return ResponseBlockedReason.ANONYMOUS;

    // Fetch async info in parallel
    const [userIsBanned, userIsApproved, userIsMuted, userSubKarma, usersFlair] = await Promise.all([
        isBanned(user.username),
        isApproved(user.username),
        isMuted(user.username),
        user.getUserKarmaFromCurrentSubreddit(),
        user.getUserFlairBySubreddit(context.subredditName)
    ]);

    // If user is banned, return banned
    if (userIsBanned)
        return ResponseBlockedReason.BANNED;

    // If user is muted, return muted
    if (userIsMuted)
        return ResponseBlockedReason.MUTED;

    // Get settings object
    const criteria = survey.responderCriteria ?? DefaultResponderCriteria;

    // Check user has verified email
    if (criteria.verifiedEmail && !user.hasVerifiedEmail)
        return ResponseBlockedReason.NOT_VERIFIED;

    // Check user is an approved user
    if (criteria.approvedUsers && !userIsApproved)
        return ResponseBlockedReason.NOT_APPROVED;

    // Check user has minimum age
    if (criteria.minAge !== null && ((Date.now() - user.createdAt.getTime()) / 86400000) < criteria.minAge)
        return ResponseBlockedReason.MIN_AGE;

    // Check user has minimum karma
    if (criteria.minKarma !== null) {
        if (criteria.minKarma.type === KarmaType.POST && user.linkKarma < criteria.minKarma.value)
            return ResponseBlockedReason.MIN_POST_KARMA;
        if (criteria.minKarma.type === KarmaType.COMMENT && user.linkKarma < criteria.minKarma.value)
            return ResponseBlockedReason.MIN_COMMENT_KARMA;
        if (criteria.minKarma.type === KarmaType.BOTH && (user.commentKarma + user.linkKarma) < criteria.minKarma.value)
            return ResponseBlockedReason.MIN_KARMA;
    }

    // Check user has minimum community karma
    if (criteria.minSubKarma !== null) {
        const subComment = userSubKarma.fromComments ?? 0;
        const subPost = userSubKarma.fromPosts ?? 0;
        if (criteria.minSubKarma.type === KarmaType.POST && subPost < criteria.minSubKarma.value)
            return ResponseBlockedReason.MIN_SUB_POST_KARMA;
        if (criteria.minSubKarma.type === KarmaType.COMMENT && subComment < criteria.minSubKarma.value)
            return ResponseBlockedReason.MIN_SUB_COMMENT_KARMA;
        if (criteria.minSubKarma.type === KarmaType.BOTH && (subPost + subComment) < criteria.minSubKarma.value)
            return ResponseBlockedReason.MIN_SUB_KARMA;
    }

    // Check user flair
    const userFlairMatch = !criteria.userFlairs || criteria.userFlairs.length <= 0 ||
        (usersFlair !== undefined && criteria.userFlairs.some(c =>
           (c.type === FlairType.TEXT_EQUAL && usersFlair.flairText?.toLowerCase() === c.value.toLowerCase()) ||
           (c.type === FlairType.TEXT_PARTIAL && new RegExp(c.value, 'i').exec(usersFlair.flairText ?? '') !== null) ||
           (c.type === FlairType.CSS_CLASS && usersFlair.flairCssClass?.toLowerCase() === c.value.toLowerCase())
        ));
    if (!userFlairMatch)
        return ResponseBlockedReason.USER_FLAIR;

    // Otherwise, there is no reason
    return undefined;
}
