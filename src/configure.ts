/*!
 * Simple file to configure the needed Devvit capabilities for the whole app.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import {Devvit} from "@devvit/public-api";

Devvit.configure({
    redditAPI: true,
    redis: true,
});