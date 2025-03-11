/*!
 * Devvit <=> WebView message communication handler.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import {UseWebViewResult} from "@devvit/public-api";
import {MessageFromDevvit, MessageToDevvit} from "../../webviewsrc/devvit/defs.js";

export const devvitOnMessage =
    async(message: MessageToDevvit, webView: UseWebViewResult<MessageFromDevvit>): Promise<void> => {

    };

