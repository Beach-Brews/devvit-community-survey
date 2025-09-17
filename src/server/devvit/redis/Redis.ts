/*!
 * Helper for accessing and saving Redis keys for the app.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { redis } from "@devvit/web/server";
import { Schema, SurveyConfig } from "./Schema.js";

const RedisKeys = {
    surveyList: (uid: string) => `sv:u${uid}:l`,
    surveyConfig: (surveyId: string) => `sv:s${surveyId}:c`
};

export class Redis {

    public async getSurveyConfig(id: string | undefined): Promise<SurveyConfig | null> {
        const config = id ? await redis.get(RedisKeys.surveyConfig(id)) : undefined;
        return config ? Schema.surveyConfig.parseAsync(JSON.parse(config)) : null;
    }

    public async setSurveyConfig(id: string, config: SurveyConfig, userId: string): Promise<void> {
        const configKey = RedisKeys.surveyConfig(id);
        const listKey = RedisKeys.surveyList(userId);
        const isNew = !(await redis.hGet(listKey, configKey));

        const txn = await redis.watch(configKey);
        await txn.multi();
        const parsed = await Schema.surveyConfig.parseAsync(config);
        await txn.set(configKey, JSON.stringify(parsed));
        if (isNew)
            await txn.hSet(listKey, { [configKey]: '' });
        await txn.exec();
    }

}
