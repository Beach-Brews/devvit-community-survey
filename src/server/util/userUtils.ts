/*!
 * Various helper methods for user related actions.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { context, reddit, User } from '@devvit/web/server';
import * as postRedis from '../devvit/redis/post';
import {
    DefaultResponderCriteria,
    FlairType,
    KarmaType,
    ResultVisibility,
    SurveyDto
} from '../../shared/redis/SurveyDto';
import { ResponseBlockedReason, ResultsHiddenReason } from '../../shared/types/postApi';

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

export const getResultsHiddenReason = async (survey: SurveyDto, user?: User): Promise<ResultsHiddenReason | null> => {

    // Get user if not specified
    user = user ?? await reddit.getCurrentUser();

    // If user is a mod, always allow
    if (user && (await isMod(user)))
        return null;

    // Switch on visibility
    switch (survey.resultVisibility) {
        case ResultVisibility.Closed:
            return survey.closeDate !== null && survey.closeDate < Date.now() ? null : ResultsHiddenReason.LIVE;
        case ResultVisibility.Responders:
            return user && (await postRedis.getUserLastResponse(user.id, survey.id)) ? null : ResultsHiddenReason.NOT_RESPONDED;
        case ResultVisibility.Mods:
            return ResultsHiddenReason.NOT_MOD;
        case ResultVisibility.Always:
        default:
            return null;
    }
};

export const getResponseBlockedReason = async (survey: SurveyDto, user?: User): Promise<ResponseBlockedReason | null> => {

    // Get user if not specified
    user = user ?? await reddit.getCurrentUser();
    if (user === undefined)
        return ResponseBlockedReason.ANONYMOUS;

    // Fetch async info in parallel
    const [userIsMod, userIsBanned, userIsApproved, userIsMuted, /*userSubKarma,*/ usersFlair] = await Promise.all([
        isMod(user),
        isBanned(user.username),
        isApproved(user.username),
        isMuted(user.username),
        //user.getUserKarmaFromCurrentSubreddit(),
        user.getUserFlairBySubreddit(context.subredditName)
    ]);

    // Always allow mods
    if  (userIsMod)
        return null;

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
        if (criteria.minKarma.type === KarmaType.Post && user.linkKarma < criteria.minKarma.value)
            return ResponseBlockedReason.MIN_POST_KARMA;
        if (criteria.minKarma.type === KarmaType.Comment && user.linkKarma < criteria.minKarma.value)
            return ResponseBlockedReason.MIN_COMMENT_KARMA;
        if (criteria.minKarma.type === KarmaType.Both && (user.commentKarma + user.linkKarma) < criteria.minKarma.value)
            return ResponseBlockedReason.MIN_KARMA;
    }

    // Check user has minimum community karma
    // TODO: Discuss allowing users to get their community karma, not only mods
    /*
    if (criteria.minSubKarma !== null) {
        const subComment = userSubKarma.fromComments ?? 0;
        const subPost = userSubKarma.fromPosts ?? 0;
        if (criteria.minSubKarma.type === KarmaType.Post && subPost < criteria.minSubKarma.value)
            return ResponseBlockedReason.MIN_SUB_POST_KARMA;
        if (criteria.minSubKarma.type === KarmaType.Comment && subComment < criteria.minSubKarma.value)
            return ResponseBlockedReason.MIN_SUB_COMMENT_KARMA;
        if (criteria.minSubKarma.type === KarmaType.Both && (subPost + subComment) < criteria.minSubKarma.value)
            return ResponseBlockedReason.MIN_SUB_KARMA;
    }
    */

    // Check user flair
    const userFlairMatch = !criteria.userFlairs || criteria.userFlairs.length <= 0 ||
        (usersFlair !== undefined && criteria.userFlairs.some(c =>
           (c.type === FlairType.TextEqual && usersFlair.flairText?.toLowerCase() === c.value.toLowerCase()) ||
           (c.type === FlairType.TextPartial && new RegExp(c.value, 'i').exec(usersFlair.flairText ?? '') !== null) ||
           (c.type === FlairType.CssClass && usersFlair.flairCssClass?.toLowerCase() === c.value.toLowerCase())
        ));
    if (!userFlairMatch)
        return ResponseBlockedReason.USER_FLAIR;

    // Otherwise, there is no reason
    return null;
}
