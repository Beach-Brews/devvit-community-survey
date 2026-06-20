/*!
* Helper to format dates. Likely switch to a library in the future.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { getWebViewMode } from '@devvit/web/client';

export const getSurveyWebviewMode = () => {
    try {
        return getWebViewMode();
    } catch (_) {
        return window.location.search === '' ? 'inline' : 'expanded';
    }
};
