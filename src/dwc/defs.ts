/*!
 * Defines Devvit <=> WebView message contracts.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */
import {JSONValue} from "@devvit/public-api";

/** Message from Devvit to the web view. */
export type DevvitMessage =
    | { type: 'initialData'; data: { postConfig: JSONValue } }
    | { type: 'updateCounter'; data: { currentCounter: number } };

/** Message from the web view to Devvit. */
export type WebViewMessage =
    | { type: 'webViewReady' }
    | { type: 'setCounter'; data: { newCounter: number } };

/**
 * Web view MessageEvent listener data type. The Devvit API wraps all messages
 * from Blocks to the web view.
 */
export type DevvitSystemMessage = {
    data: { message: DevvitMessage };
    /** Reserved type for messages sent via `context.ui.webView.postMessage`. */
    type?: 'devvit-message' | string;
};

