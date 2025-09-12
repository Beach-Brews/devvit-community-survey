/*!
 * Helper for receiving app settings.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import {SettingsClient} from '@devvit/settings';

// Represents the log level of the application.
export enum LogLevel {
    Error,
    Warn,
    Info,
    Debug,
    Trace
}

// An enum of all settings keys (internal AppSettings use only)
enum SettingKeys {

    // Logging level
    LogLevel = 'log-level'

}

export class AppSettings {

    // Gets the configured log level to reduce the amount of logs
    public static async GetLogLevel(settings: SettingsClient): Promise<LogLevel> {
        const savedLvl = await settings.get<string[]>(SettingKeys.LogLevel);
        const key = savedLvl && savedLvl.length > 0 && savedLvl[0] ? savedLvl[0] : null;
        return (key ? LogLevel[key as keyof typeof LogLevel] : LogLevel.Error) ?? LogLevel.Error;
    }

}
