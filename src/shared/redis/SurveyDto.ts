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

export const ResultVisibility = {
    Always: 'Always',
    Closed: 'Closed',
    Mods: 'Mods'
} as const;

export type ResultVisibilityType = (typeof ResultVisibility)[keyof typeof ResultVisibility];

export const KarmaType = {
    Both: 'Both',
    Comment: 'Comment',
    Post: 'Post'
} as const;

export type KarmaTypeType = (typeof KarmaType)[keyof typeof KarmaType];

export type KarmaCriteriaDto = {
    type: KarmaTypeType;
    value: number;
}

export const FlairType = {
    TextEqual: 'TxtEq',
    TextPartial: 'TxtPart',
    CssClass: 'CssCls'
} as const;

export type FlairTypeType = (typeof FlairType)[keyof typeof FlairType];

export type FlairCriteriaDto = {
    type: FlairTypeType;
    value: string;
};

export type ResponderCriteriaDto = {
    verifiedEmail: boolean;
    approvedUsers: boolean;
    minAge: null | number;
    minKarma: KarmaCriteriaDto | null;
    minSubKarma: KarmaCriteriaDto | null;
    userFlairs: null | FlairCriteriaDto[]
};

export const DefaultResponderCriteria: ResponderCriteriaDto = {
    verifiedEmail: false,
    approvedUsers: false,
    minAge: null,
    minKarma: null,
    minSubKarma:  null,
    userFlairs: null
};

export type SurveyDto = {
    id: string;
    owner: string;
    title: string;
    intro: string;
    outro: string;
    allowMultiple: boolean;
    responderCriteria: ResponderCriteriaDto | null | undefined,
    resultVisibility: ResultVisibilityType | null | undefined,
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
