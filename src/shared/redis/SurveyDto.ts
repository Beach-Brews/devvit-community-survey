/*!
 * DTOs for Redis schema objects, used to pass configurations between client and server.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

export type QuestionOptionDto = {
    label: string;
    value: string;
};

export type QuestionType = 'text' | 'scale' | 'rank' | 'multi' | 'checkbox';

export type CommonQuestionProps = {
    id: string;
    title: string;
    description: string;
    required: boolean;
};

export type TextQuestionDto = CommonQuestionProps & {
    type: 'text';
    min: number;
    max: number;
};

export type ScaleKind = 'otf' | 'ott';

export type ScaleQuestionDto = CommonQuestionProps & {
    type: 'scale';
    kind: ScaleKind;
    min: number;
    max: number;
    minLabel: string;
    midLabel: string;
    maxLabel: string;
};

export type MultiOptionQuestionTypes = 'multi' | 'checkbox' | 'rank';

export type MultiOptionQuestion = CommonQuestionProps & {
    type: MultiOptionQuestionTypes;
    options: QuestionOptionDto[];
};

export type SurveyQuestionDto = TextQuestionDto | ScaleQuestionDto | MultiOptionQuestion;

export type SurveyQuestionList = SurveyQuestionDto[];

export type SurveyDto = {
    id: string;
    owner: string;
    title: string;
    intro: string;
    outro: string;
    allowMultiple: boolean;
    createDate: number;
    publishDate: number | null;
    closeDate: number | null;
    deleteQueued?: boolean;
    responseCount?: number;
    questions?: SurveyQuestionList;
};

export type SurveyWithQuestionsDto = SurveyDto & {
    questions: SurveyQuestionList;
}
