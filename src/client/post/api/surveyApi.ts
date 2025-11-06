/*!
* API for getting survey questions and sending responses.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ApiResponse } from '../../../shared/types/api';
import { InitializeSurveyResponse } from '../../../shared/types/postApi';

export const initializeSurvey = async (): Promise<InitializeSurveyResponse | null> => {
    /**/
    const resp = await fetch('/api/post/survey');
    return resp.ok ? (await resp.json() as ApiResponse<InitializeSurveyResponse>)?.result ?? null : null;
    /**/
    /*
    return await new Promise((res, _rej) => {
        setTimeout(() => {
            const options = [
                {
                    label: 'First Choice',
                    value: genOptionId()
                },
                {
                    label: 'Second Choice',
                    value: genOptionId()
                },
                {
                    label: 'Third Choice',
                    value: genOptionId()
                }
            ];
            const dto = {
                id: genSurveyId(),
                owner: 't2_asdfasdf',
                title: 'Testing Survey',
                intro: 'Please test this survey',
                outro: 'Thanks for testing!',
                responseCount: 1622,
                allowMultiple: false,
                createDate: Date.now(),
                publishDate: Date.now(),
                closeDate: Date.now() + 24*3600000,
                questions: [
                    {
                        type: 'multi',
                        id: genQuestionId(),
                        required: false,
                        title: 'Test Multi Choice',
                        description: 'This is a multi choice question',
                        options: options
                    },
                    {
                        type: 'checkbox',
                        id: genQuestionId(),
                        required: true,
                        title: 'Test Checkbox',
                        description: 'This is a checkbox question',
                        options: options
                    },
                    {
                        type: 'rank',
                        id: genQuestionId(),
                        required: false,
                        title: 'Test Rank',
                        description: 'This is a rank question that has a really long description that I hope increases the page size enough to test whether this should be max of 100% or of 100vh. It isn\'t really clear whether screen is outside the iframe size or not.This is a rank question that has a really long description that I hope increases the page size enough to test whether this should be max of 100% or of 100vh. It isn\'t really clear whether screen is outside the iframe size or not.This is a rank question that has a really long description that I hope increases the page size enough to test whether this should be max of 100% or of 100vh. It isn\'t really clear whether screen is outside the iframe size or not.',
                        options: options
                    },
                    {
                        type: 'scale',
                        kind: 'otf',
                        id: genQuestionId(),
                        required: true,
                        title: 'Test Scale One to Five',
                        description: 'This is a scale question, with choices between 1 and 5',
                        min: 1,
                        minLabel: 'Lower',
                        midLabel: 'Middle',
                        max: 5,
                        maxLabel: 'Upper'
                    },
                    {
                        type: 'scale',
                        kind: 'ott',
                        id: genQuestionId(),
                        required: false,
                        title: 'Test Scale One to Ten',
                        description: 'This is a scale question, with choices between 1 and 10',
                        min: 1,
                        minLabel: 'Lower',
                        midLabel: 'Middle',
                        max: 10,
                        maxLabel: 'Upper'
                    }
                ]
            } satisfies SurveyWithQuestionsDto;
            res({
                survey: dto,
                user: {
                    isMod: true,
                    userId: 't2_asdfg12345',
                    username: 'beach-brews',
                    snoovar: ''
                }
            } satisfies InitializeSurveyResponse);
        }, 2000);
    });
    /**/
};
