export type QuestionTypeSelectorProps = {
    id: string;
    val: string;
    setQuestionType: (type: string) => void;
};

const options = {
    'text': 'Text',
    'paragraph': 'Paragraph'
};

export const QuestionTypeSelector = (props: QuestionTypeSelectorProps) => {

    const selectorId = `qtype-${props.id}`;

    const selectOptions = Object.keys(options).map(k => (
        <option id={selectorId + '-' + k} key={selectorId + '-' +k} value={k}>{options[k]}</option>
    ));

    return (
        <div className="type-selector">
            <label htmlFor={selectorId}>Question Type:</label>
            <select value={props.val} onChange={(e) => props.setQuestionType(e.target.value)} id={selectorId}>
                {...selectOptions}
            </select>
        </div>
    );
}