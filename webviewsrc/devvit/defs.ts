/*!
 * Defines the message contracts between the WebView and Devvit.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

/* ========================================================================= */
/* ==================== Messages From WebView To Devvit ==================== */
/* ========================================================================= */
export type FutureToDevvit = { name: string };

export type MessageToDevvit = {
    type: "INIT"
} | {
    type: "FUTURE_MESSAGE";
    payload: FutureToDevvit;
};

/* ========================================================================= */
/* ==================== Messages From Devvit To WebView ==================== */
/* ========================================================================= */
export type InitFromDevvit = {
    postConfig: {
        isOwner: boolean,
        title: string,
        intro: string,
        closeDate: string,
        allowMultiple: boolean,
        publishDate: string,
        status: 'draft'|'live'
    }
};
export type FutureFromDevvit = { number: number; name: string; error?: string };

export type MessageFromDevvit = {
    type: "INIT_RESPONSE";
    payload: InitFromDevvit;
} | {
    type: "FUTURE_RESPONSE";
    payload: FutureFromDevvit;
};

export type DevvitMessage = {
    type: "devvit-message";
    data: { message: MessageFromDevvit };
};