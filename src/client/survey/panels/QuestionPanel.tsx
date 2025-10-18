/*!
* Renders a question to the user.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { SurveyContext } from '../SurveyContext';

export const QuestionPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    return (
        <div>
            <div>Question Panel for question: {ctx.panelContext.number}</div>
        </div>
    );
};
