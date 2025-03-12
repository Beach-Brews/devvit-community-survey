export type QuestionOptionModel = {
    label: string;
    value: string;
};

export type BaseQuestionModel = {
    id: string;
    order: number;
    title: string;
    description: string;
    required: boolean;
};

export type TextQuestionModel = BaseQuestionModel & {
    type: 'text';
    min: number;
    max: number;
};

export type ParagraphQuestionModel = BaseQuestionModel & {
    type: 'paragraph';
    min: number;
    max: number;
};

export type ScaleQuestionModel = BaseQuestionModel & {
    type: 'scale';
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
};

export type DropdownQuestionModel = BaseQuestionModel & {
    type: 'dropdown';
    options: QuestionOptionModel[]
};

export type MultiChoiceQuestionModel = BaseQuestionModel & {
    type: 'multi';
    options: QuestionOptionModel[];
};

export type CheckboxQuestionModel = BaseQuestionModel & {
    type: 'checkbox';
    options: QuestionOptionModel[];
};

export type DescriptionQuestionModel = BaseQuestionModel & {
    type: 'description';
};

export type QuestionModel = TextQuestionModel |
    ParagraphQuestionModel |
    ScaleQuestionModel |
    DropdownQuestionModel |
    MultiChoiceQuestionModel |
    CheckboxQuestionModel |
    DescriptionQuestionModel;

export type SurveyConfigModel = {
    isOwner: boolean,
    title: string,
    intro: string,
    closeDate: string,
    allowMultiple: boolean,
    publishDate: string,
    status: 'draft'|'live'
};

export type SurveyResponseValueModel = {
    value: string | number;
};

export type SurveyResponseModel = {
    owner: string,
    ownerId: string,
    responses: SurveyResponseValueModel[]
};