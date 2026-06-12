/*!
 * Mock data responses for testing survey post cards locally.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { defineMock } from 'vite-plugin-mock-dev-server';
import { SampleQuestionList, SampleSubInfo, SampleSurveyList, SampleUserInfo } from './mockData';
import { ApiResponse } from '../../shared/types/api';
import { InitializeSurveyResponse } from '../../shared/types/postApi';

// noinspection JSUnusedGlobalSymbols
export default defineMock([
    {
        url: '/api/post/survey',
        method: 'GET',
        body: {
            code: 200,
            message: 'Ok',
            result: {
                survey: SampleSurveyList[0]!,
                user: SampleUserInfo,
                subInfo: SampleSubInfo,
                lastResponse: { [SampleQuestionList[0]!.id]: [SampleQuestionList[0]!.options![0]!.value] }
            } satisfies InitializeSurveyResponse
        } satisfies ApiResponse<InitializeSurveyResponse>
    }
]);
