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
import { QuestionResponseDto, ResponseValuesDto } from '../../shared/redis/ResponseDto';

const mockSurveyIdx = 0;

// noinspection JSUnusedGlobalSymbols
export default defineMock([
    {
        url: '/api/post/survey',
        method: 'GET',
        body: {
            code: 200,
            message: 'Ok',
            result: {
                survey: SampleSurveyList[mockSurveyIdx]!,
                user: SampleUserInfo,
                subInfo: SampleSubInfo,
                lastResponse: { [SampleQuestionList[0]!.id]: [SampleQuestionList[0]!.options![0]!.value] }
            } satisfies InitializeSurveyResponse
        } satisfies ApiResponse<InitializeSurveyResponse>
    },
    {
        url: '/api/post/survey/:questionId',
        method: 'POST',
        body: {
            code: 200,
            message: 'Ok',
            result: true
        } satisfies ApiResponse<boolean>
    },
    {
        url: '/api/post/survey/results/:questionId',
        method: 'GET',
        body: (req) => {
            const questionId = req.params.questionId as string;
            const question = SampleQuestionList.find(q => q.id === questionId);
            // Randomize results
            let total = 0;
            const responses: ResponseValuesDto = question?.options !== undefined
                ? question.options.reduce((a, o) => {
                    const val = total >= 100 ? Math.floor(Math.random()*2) : 100;
                    total += val;
                    a[o.value] = val;
                    return a;
                }, {} as ResponseValuesDto)
                : question?.type === 'scale'
                    ? Array.from({ length: question.max ?? 5 }, (_, i) => i + 1)
                        .reduce((a, i) => {
                            const val = total >= 100 ? Math.floor(Math.random()*2) : 100;
                            total += val;
                            a[i.toString()] = val;
                            return a;
                        }, {} as ResponseValuesDto)
                    : {};
            return {
                message: "Success",
                code: 200,
                result: {
                    responses: responses,
                    total: total
                }
            } satisfies ApiResponse<QuestionResponseDto>;
        }
    }
]);
