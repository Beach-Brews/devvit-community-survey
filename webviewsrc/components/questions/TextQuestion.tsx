import {BaseQuestionProps} from "./BaseQuestionProps";
import {TextQuestionModel} from "../../devvit/models";
import {QuestionTypeSelector} from "./QuestionTypeSelector";

export type TextQuestionProps = BaseQuestionProps<TextQuestionModel>;

export const TextQuestion = (props: TextQuestionProps) => {
    return (
        <div className="question text-question" id={props.question.id} key={props.question.id}>
            <h2>{props.question.title}</h2>
            <p>{props.question.description}</p>
            {props.setQuestionType && <QuestionTypeSelector id={props.question.id} val={'text'} setQuestionType={props.setQuestionType} />}
        </div>
    );
};