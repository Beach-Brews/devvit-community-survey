/*!
 * Helper for accessing and saving Redis keys for the app.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Context, Devvit} from "@devvit/public-api";
import {Schema, SurveyConfig, SurveyResponse} from "./Schema.js";

const RedisKeys = {
    surveyConfig: (postId: string) => `sv:p:${postId}:c`,
    surveyUserResponse: (postId: string, userId: string, responseId: string) => `sv:r:${postId}:${userId}:${responseId}`,
    surveyResponseIdList: (postId: string) => `sv:p:${postId}:r`
};

export class Redis {

    #redis: Devvit.Context['redis'];

    constructor(redis: Devvit.Context['redis']) {
        this.#redis = redis;
    }

    public async getSurveyConfig(id: string | undefined): Promise<SurveyConfig | null> {
        const config = id ? await this.#redis.get(RedisKeys.surveyConfig(id)) : undefined;
        return config ? Schema.surveyConfig.parseAsync(JSON.parse(config)) : null;
    }

    public async setSurveyConfig(id: string, config: SurveyConfig): Promise<void> {
        const parsed = await Schema.surveyConfig.parseAsync(config);
        await this.#redis.set(RedisKeys.surveyConfig(id), JSON.stringify(parsed));
    }

    public async getResponseCount(ctx: Context): Promise<number>  {
        if (!ctx.postId) return 0;
        const resp = await this.#redis.hLen(RedisKeys.surveyResponseIdList(ctx.postId));
        return resp ? resp : 0;
    }

    public async getMyResponseById(ctx: Context, responseId: string): Promise<SurveyResponse | null> {
        if (!ctx.postId || !ctx.userId) return null;
        const resp = await this.#redis.get(RedisKeys.surveyUserResponse(ctx.postId, ctx.userId, responseId));
        return resp ? Schema.surveyResponse.parseAsync(JSON.parse(resp)) : null;
    }

    public async getMyResponses(ctx: Context): Promise<[string,string][] | null> {
        if (!ctx.postId || !ctx.userId) return null;
        const resp = await this.#redis.hScan(RedisKeys.surveyResponseIdList(ctx.postId), 0, `${ctx.userId}:.*`);
        if (!resp) return null;
        return resp.fieldValues.map(f => [f.field, f.value]);
    }

    public async hasResponded(ctx: Context): Promise<boolean> {
        return !!ctx.postId && !!ctx.userId && ((await this.getMyResponses(ctx))?.length ?? 0) > 0;
    }
}