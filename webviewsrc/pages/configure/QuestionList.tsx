import {PageProps} from "../pageDefs";
import {ParagraphQuestionModel, QuestionModel, TextQuestionModel} from "../../devvit/models";
import {TextQuestion} from "../../components/questions/TextQuestion";
import {useState} from "react";
import {ParagraphQuestion} from "../../components/questions/ParagraphQuestion";

export const QuestionList = (props: PageProps) => {
    const [qType, setQuestionType] = useState('text');
    const questions: QuestionModel[] = [
        qType === 'text' ?
        {
            id: '12345',
            order: 0,
            title: 'My Text Question',
            description: 'This is what to enter into the input',
            required: true,
            type: 'text',
            min: 10,
            max: 100
        } satisfies TextQuestionModel
        : {
            id: '12345',
            order: 0,
            title: 'My Paragraph Question',
            description: 'This is what to enter into the textarea',
            required: true,
            type: 'paragraph',
            min: 10,
            max: 100
        } satisfies ParagraphQuestionModel
    ];

    const questionJsx = questions.map(q => {
        switch(q.type) {
            case 'text':
                return (<TextQuestion key={q.id} question={q} setQuestionType={setQuestionType} />);
            case 'paragraph':
                return (<ParagraphQuestion key={q.id} question={q} setQuestionType={setQuestionType} />);

            default:
                console.error('Unknown question type ' + q.type);
                return null;
        }
    });

    return (
        <div id="question-container">
            <div className="questions">
                <div>
                    <h1>{props.initialData.postConfig.title}</h1>
                    <p>{props.initialData.postConfig.intro}</p>
                </div>
                {...questionJsx}
            </div>
            <div className="drawer">
                <nav>
                    <ul>
                        <li>+</li>
                        <li>^</li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};