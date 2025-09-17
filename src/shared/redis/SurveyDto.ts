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

export type CommonQuestionProps = {
    id: string;
    order: number;
    title: string;
    description: string;
    required: boolean;
};

export type TextQuestionDto = CommonQuestionProps & {
    type: 'text';
    min: number;
    max: number;
};

export type ScaleQuestionDto = CommonQuestionProps & {
    type: 'scale';
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
};

export type RankQuestionDto = CommonQuestionProps & {
    type: 'rank';
    options: QuestionOptionDto[];
};

export type MultiChoiceQuestionDto = CommonQuestionProps & {
    type: 'multi';
    options: QuestionOptionDto[];
};

export type CheckboxQuestionDto = CommonQuestionProps & {
    type: 'checkbox';
    options: QuestionOptionDto[];
};

export type DescriptionQuestionDto = CommonQuestionProps & {
    type: 'description';
};

export type SurveyQuestionDto = TextQuestionDto | ScaleQuestionDto | RankQuestionDto | MultiChoiceQuestionDto | CheckboxQuestionDto | DescriptionQuestionDto;

export type SurveyQuestionList = SurveyQuestionDto[];

export type SurveyDto = {
    title: string;
    intro: string;
    allowMultiple: boolean;
    createDate: number;
    publishDate: number | null;
    closeDate: number | null;
    questions: SurveyQuestionList;
};
