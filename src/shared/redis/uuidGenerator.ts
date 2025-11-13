/*!
 * Helper for generating survey and question IDs
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

import { QuestionOptionDto, SurveyDto, SurveyQuestionDto } from './SurveyDto';

const genUid = () => {
    return (Date.now().toString(36).substring(3)
        + Math.random().toString(36).substring(2, 7));
}

export const UserIdRegex = /^t2_[0-9a-zA-Z]{4,}$/;
export const SurveyIdRegex = /^sv_[0-9a-zA-Z]{10}$/;
export const QuestionIdRegex = /^sq_[0-9a-zA-Z]{10}$/;
export const OptionIdRegex = /^sqo_[0-9a-zA-Z]{10}$/;
export const ResponseIdRegex = /^sqr_[0-9a-zA-Z]{10}$/;

export const genSurveyId = () => `sv_${genUid()}`;
export const genQuestionId = () => `sq_${genUid()}`;
export const genOptionId = () => `sqo_${genUid()}`;
export const genResponseId = () => `sqo_${genUid()}`;

export function assertId(
    idVal: string | null | undefined,
    idRegEx: RegExp,
    idType: string
): asserts idVal is NonNullable<string> {
    if (!idVal|| !idRegEx.test(idVal)) throw Error(`Invalid ${idType} ID: ${idVal ?? (typeof idVal)}`);
}

export function assertUserId(
    userId: string | null | undefined
): asserts userId is NonNullable<string> {
    assertId(userId, UserIdRegex, 'User');
}

export function assertSurveyId(
    surveyId: string | null | undefined
): asserts surveyId is NonNullable<string> {
    assertId(surveyId, SurveyIdRegex, 'Survey');
}

export function assertQuestionId(
    questionId: string | null | undefined
): asserts questionId is NonNullable<string> {
    assertId(questionId, QuestionIdRegex, 'Question');
}

export function assertOptionId(
    optionId: string | null | undefined
): asserts optionId is NonNullable<string> {
    assertId(optionId, OptionIdRegex, 'Option');
}

export const genSurvey = (): SurveyDto => {
    return {
        id: genSurveyId(),
        title: 'Untitled Survey',
        owner: '',
        intro: '',
        outro: 'Thank you for your response.',
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
        required: true,
        type: 'multi',
        options: [ genOption(0) ]
    };
}

export const genOption = (order: number): QuestionOptionDto => {
    return             {
        label: `Option #${order+1}`,
        value: genOptionId()
    };
};
