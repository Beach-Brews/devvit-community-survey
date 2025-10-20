/*!
* API for getting survey questions and sending responses.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyWithQuestionsDto } from '../../../shared/redis/SurveyDto';
import { genOptionId, genQuestionId, genSurveyId } from '../../../shared/redis/uuidGenerator';
//import { ApiResponse } from '../../../shared/types/api';

export const getPostSurvey = async (): Promise<SurveyWithQuestionsDto | null> => {
    //const resp = await fetch('/api/post/survey');
    //return resp.ok ? (await resp.json() as ApiResponse<SurveyDto>)?.result ?? null : null;
    return await new Promise((res, _rej) => {
        setTimeout(() => {
            const dto = {
                id: genSurveyId(),
                owner: 't2_asdfasdf',
                title: 'Testing Survey',
                intro: 'Please test this survey',
                outro: 'Thanks for testing!',
                responseCount: 0,
                allowMultiple: false,
                createDate: Date.now(),
                publishDate: Date.now(),
                closeDate: null,
                questions: [
                    {
                        type: 'multi',
                        id: genQuestionId(),
                        required: false,
                        title: 'Test Multi Choice',
                        description: 'This is a multi choice question',
                        options: [
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
                        ]
                    },
                    {
                        type: 'checkbox',
                        id: genQuestionId(),
                        required: true,
                        title: 'Test Checkbox',
                        description: 'This is a checkbox question',
                        options: [
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
                        ]
                    },
                    {
                        type: 'rank',
                        id: genQuestionId(),
                        required: false,
                        title: 'Test Rank',
                        description: 'This is a rank question',
                        options: [
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
                        ]
                    },
                    {
                        type: 'scale',
                        kind: 'otf',
                        id: genQuestionId(),
                        required: false,
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
            res(dto);
        }, 2000);
    });
};
