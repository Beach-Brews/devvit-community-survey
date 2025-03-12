import {QuestionModel, SurveyResponseValueModel} from "../../devvit/models";

export type BaseQuestionProps<T extends QuestionModel> = {
    question: T;
    response?: SurveyResponseValueModel | null | undefined,
    setQuestionType?: (type: string) => void
};