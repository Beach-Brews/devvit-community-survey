/*!
* Editor for multiple chose questions.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { CommonQuestionEditorProps } from './commonEditorTypes';

export const MultiQuestionEditor = (props: CommonQuestionEditorProps) => {
    return (
        <>
            <div>Multiple Choice Question Editor</div>
            <div>{props.question.title}</div>
        </>
    )
};
