import {BaseQuestionProps} from "./BaseQuestionProps";
import {ParagraphQuestionModel} from "../../devvit/models";
import {QuestionTypeSelector} from "./QuestionTypeSelector";

export type ParagraphQuestionProps = BaseQuestionProps<ParagraphQuestionModel>;

export const ParagraphQuestion = (props: ParagraphQuestionProps) => {
    return (
        <div className="question paragraph-question" id={props.question.id} key={props.question.id}>
            <h2>{props.question.title}</h2>
            <p>{props.question.description}</p>
            {props.setQuestionType && <QuestionTypeSelector id={props.question.id} val={'paragraph'} setQuestionType={props.setQuestionType} />}
        </div>
    );
};