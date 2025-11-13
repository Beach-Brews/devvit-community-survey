/*!
* Utility function for determining if debug is enabled.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {context} from '@devvit/web/client';

export const debugEnabled = (): boolean => {
    return context?.userId === 't2_1a3euo740x';
};
