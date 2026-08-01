/*!
 * Mock data responses for testing survey dashboard locally.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import { defineMock } from 'vite-plugin-mock-dev-server';
import { SampleSurveyList, SampleUserInfo } from './mockData';
import { ApiResponse, MessageResponse } from '../../shared/types/api';
import { UserInfoDto } from '../../shared/types/postApi';
import { SurveyWithQuestionsDto } from '../../shared/redis/SurveyDto';
import { DashboardListDto, SubredditUserFlairsResult } from '../../shared/types/dashboardApi';

// noinspection JSUnusedGlobalSymbols
export default defineMock([
    {
        url: '/api/dash/user-info',
        method: 'GET',
        body: {
            code: 200,
            message: 'OK',
            result: SampleUserInfo
        } satisfies ApiResponse<UserInfoDto>
    },
    {
        url: '/api/dash/survey/list',
        method: 'GET',
        body: {
            code: 200,
            message: 'OK',
            result: {
                appUpdateInfo: { "latestVersion": "0.1.1", "urgent": false, "message": "Survey posts have been redesigned! Choose your theme color. Dashboard redesign coming soon." },
                surveys: SampleSurveyList
            }
        } satisfies ApiResponse<DashboardListDto>
    },
    {
        url: '/api/dash/survey/:surveyId/close',
        method: 'POST',
        body: (req) => {
            const surveyId = req.params.surveyId;
            const foundSurvey = SampleSurveyList.find(s => s.id === surveyId);
            if (foundSurvey) {
                foundSurvey.closeDate = Date.now();
                return {
                    code: 200,
                    message: 'OK',
                    result: undefined
                } satisfies MessageResponse;
            }
            return {
                code: 404,
                message: 'Not Found',
                result: undefined
            } satisfies MessageResponse;
        }
    },
    {
        url: '/api/dash/survey/:surveyId',
        method: 'GET',
        body: (req) => {
            const surveyId = req.params.surveyId;
            const foundSurvey = SampleSurveyList.find(s => s.id === surveyId);
            if (foundSurvey) {
                return {
                    code: 200,
                    message: 'OK',
                    result: foundSurvey
                } satisfies ApiResponse<SurveyWithQuestionsDto>;
            }
            return {
                code: 404,
                message: 'Not Found',
                result: undefined
            } satisfies MessageResponse;
        }
    },
    {
        url: '/api/dash/survey/:surveyId',
        method: 'POST',
        body: (req) => {
            const surveyId = req.params.surveyId;
            const foundSurvey = SampleSurveyList.find(s => s.id === surveyId);
            if (foundSurvey) {
                // TODO: Update dto from body
                return {
                    code: 200,
                    message: 'OK',
                    result: foundSurvey
                } satisfies ApiResponse<SurveyWithQuestionsDto>;
            }
            return {
                code: 404,
                message: 'Not Found',
                result: undefined
            } satisfies MessageResponse;
        }
    },
    {
        url: '/api/dash/survey/:surveyId',
        method: 'DELETE',
        body: (req) => {
            const surveyId = req.params.surveyId;
            const foundSurvey = SampleSurveyList.find(s => s.id === surveyId);
            if (foundSurvey) {
                // TODO: Delete survey from list
                return {
                    code: 200,
                    message: 'OK',
                    result: undefined
                } satisfies MessageResponse;
            }
            return {
                code: 404,
                message: 'Not Found',
                result: undefined
            } satisfies MessageResponse;
        }
    },
    {
        url: '/api/dash/flairs',
        method: 'GET',
        body: (req) => {
            const surveyId = req.params.surveyId;
            const foundSurvey = SampleSurveyList.find(s => s.id === surveyId);
            if (foundSurvey) {
                // TODO: Delete survey from list
                return {
                    code: 200,
                    message: 'OK',
                    result: {
                        flairs: []
                    }
                } satisfies ApiResponse<SubredditUserFlairsResult>;
            }
            return {
                code: 404,
                message: 'Not Found',
                result: undefined
            } satisfies MessageResponse;
        }
    }
]);
