/*!
 * Helper for generating survey and question IDs
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { SurveyQuestionDto } from './SurveyDto';

const genUid = () => {
    return (Date.now().toString(36).substring(3)
        + Math.random().toString(36).substring(2, 7));
};

export const genSurveyId = () => `sv_${genUid()}`;

export const genQuestionId = () => `sq_${genUid()}`;

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
                label: "Option #1",
                value: "option-1"
            }
        ]
    };
}
