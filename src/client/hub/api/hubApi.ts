/*!
* API for getting surveys for the Survey Hub.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ApiResponse } from '../../../shared/types/api';
import { InitializeHubResponse } from '../../../shared/types/postApi';

export const initializeHub = async (): Promise<InitializeHubResponse | null> => {
    const resp = await fetch('/api/hub/init');
    return resp.ok ? (await resp.json() as ApiResponse<InitializeHubResponse>)?.result ?? null : null;
};
