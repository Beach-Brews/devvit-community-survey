/*!
 * Defines app settings.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit, SettingScope} from "@devvit/public-api";
import {SettingsKey} from "./utils/settings.js";

Devvit.addSettings([
    {
        type: 'select',
        name: SettingsKey.DebugLevel,
        label: 'Logging Level',
        options: [
            {
                label: 'Error / Warn',
                value: 'ERROR'
            },
            {
                label: 'Info',
                value: 'INFO'
            },
            {
                label: 'Debug',
                value: 'DEBUG'
            }
        ],
        multiSelect: false,
        scope: SettingScope.Installation
    }
]);