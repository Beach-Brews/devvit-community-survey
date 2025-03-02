/*!
 * Devvit <=> WebView message communication handler.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import {DevvitMessage, WebViewMessage} from "./defs.js";
import {UseWebViewResult} from "@devvit/public-api";

export const devvitOnMessage =
    async(message: WebViewMessage, webView: UseWebViewResult<DevvitMessage>): Promise<void> => {

    };

