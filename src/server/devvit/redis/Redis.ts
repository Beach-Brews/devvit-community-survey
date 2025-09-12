/*!
 * Helper for accessing and saving Redis keys for the app.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { RedisClient } from "@devvit/web/server";
import { Schema, SurveyConfig } from "./Schema.js";

const RedisKeys = {
    surveyList: () => `sv:list`,
    surveyConfig: (surveyId: string) => `sv:${surveyId}:c`
};

export class Redis {

    #redis: RedisClient;

    constructor(redis: RedisClient) {
        this.#redis = redis;
    }

    public async getSurveyConfig(id: string | undefined): Promise<SurveyConfig | null> {
        const config = id ? await this.#redis.get(RedisKeys.surveyConfig(id)) : undefined;
        return config ? Schema.surveyConfig.parseAsync(JSON.parse(config)) : null;
    }

    public async setSurveyConfig(id: string, config: SurveyConfig): Promise<void> {
        const configKey = RedisKeys.surveyConfig(id);
        const listKey = RedisKeys.surveyList();
        const isNew = !(await this.#redis.hGet(listKey, configKey));

        const txn = await this.#redis.watch(configKey);
        await txn.multi();
        const parsed = await Schema.surveyConfig.parseAsync(config);
        await txn.set(configKey, JSON.stringify(parsed));
        if (isNew)
            await txn.hSet(RedisKeys.surveyList(), { [configKey]: '' });
        await txn.exec();
    }

}
