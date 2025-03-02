/*!
 * Helper methods for logging.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import {getSetting, SettingsKey} from "./settings.js";
import {Context} from "@devvit/public-api";

export class Logger {

    readonly #name: string;

    public static CreateLogger(name: string) {
        return new Logger(name);
    }

    private constructor(name: string) {
        this.#name = name;
    }

    public debug(ctx: Context, ...data: any): void {
        this.logIfEnabled(ctx, 'DEBUG', ...data);
    }

    public info(ctx: Context, ...data: any): void {
        this.logIfEnabled(ctx, 'INFO', ...data)
    }

    public warn(_: Context, ...data: any): void {
        console.warn(this.prefix('WARN'), ...data);
    }

    public error(ctx: Context, ...data: any): void;
    public error(ctx: Context, err: Error, ...data: any): void;
    public error(_: Context, err: Error | undefined, ...data: any): void {
        if (err)
            console.error(this.prefix('ERROR'), err, ...data);
        else
            console.error(this.prefix('ERROR'), ...data);
    }

    private logIfEnabled(ctx: Context, lvl: string, ...data: any) {
        (async () => {
            const setting = await getSetting<string>(ctx, SettingsKey.DebugLevel) ?? 'ERROR';
            if ((setting !== 'ERROR' && lvl === 'INFO') || (setting === 'DEBUG' && lvl === 'DEBUG'))
                console.log(this.prefix(lvl), ...data);
        })();
    }

    private prefix(lvl: string): string {
        return `${new Date().toISOString()} - ${this.#name} - [${lvl}] - `;
    }
}