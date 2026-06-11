/*!
 * Mock data responses for testing survey hub locally.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { defineMock } from 'vite-plugin-mock-dev-server';
import { SampleSubInfo, SampleSurveyList, SampleUserInfo } from './mockData';
import { ApiResponse } from '../../shared/types/api';
import { InitializeHubResponse } from '../../shared/types/postApi';

// noinspection JSUnusedGlobalSymbols
export default defineMock([
    {
        url: '/api/hub/init',
        method: 'GET',
        body: {
            code: 200,
            message: 'OK',
            result: {
                surveys: SampleSurveyList
                    .filter(s => s.publishDate)
                    .sort((a, b) =>
                        a.publishDate! - b.publishDate!),
                user: SampleUserInfo,
                subInfo: SampleSubInfo
            }
        } satisfies ApiResponse<InitializeHubResponse>
    }
]);
