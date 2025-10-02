/*!
 * Helper for generating survey and question IDs
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { SurveyDto, SurveyQuestionDto } from './SurveyDto';

const genUid = () => {
    return (Date.now().toString(36).substring(3)
        + Math.random().toString(36).substring(2, 7));
};

export const genSurveyId = () => `sv_${genUid()}`;

export const genQuestionId = () => `sq_${genUid()}`;

export const genOptionId = () => `sqo_${genUid()}`;

export const genSurvey = (): SurveyDto => {
    return {
        id: genSurveyId(),
        title: 'Untitled Survey',
        intro: '',
        outro: 'Than you for your response.',
        allowMultiple: false,
        createDate: Date.now(),
        publishDate: null,
        closeDate: null,
        responseCount: 0,
        questions: [ genQuestion(0) ]
    };
};

export const genQuestion = (order: number): SurveyQuestionDto => {
    return {
        id: genQuestionId(),
        title: `New Question #${order+1}`,
        description: '',
        order: order,
        required: false,
        type: 'multi',
        options: [
            {
                label: 'Option #1',
                value: ''
            }
        ]
    };
}
