/*!
* Defines types for toaster messages.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { JSX } from 'react';

export enum ToastType {
    Info, // Blue (default)
    Success, // Green
    Alert, // Yellow
    Error // Red
}

export type Toast = {
    id?: string | undefined;
    heading?: string | JSX.Element | undefined;
    message: string | JSX.Element;
    icon?: JSX.Element | null | undefined;
    type?: ToastType | undefined;
    time?: number | undefined;
};

export type AddToast = (toast: Toast) => void;
export type RemoveToast = (toastId: string) => void;
