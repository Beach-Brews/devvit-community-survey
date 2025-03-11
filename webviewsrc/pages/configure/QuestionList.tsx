import {PageProps} from "../pageDefs";

export const QuestionList = (props: PageProps) => {
    const questions = [];
    if (!questions || questions.length <= 0) {
        return (
            <div>
                Add a question
            </div>
        );
    }
    return (
        <div>
            {...questions}
        </div>
    );
};