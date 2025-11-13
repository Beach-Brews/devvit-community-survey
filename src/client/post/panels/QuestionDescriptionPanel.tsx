/*!
* A panel to display the description text of a question, similar to a modal, when the text is too long.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

export const QuestionDescriptionPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    // Get question
    const totalQs = ctx.survey.questions.length;
    const qNo = ctx.panelContext.number;
    const question = qNo !== undefined && qNo < totalQs
        ? ctx.survey.questions[qNo]
        : undefined;

    const returnToSurvey = () => {
        const { prev, ...currentContext } = ctx.panelContext;
        ctx.setPanelContext({ ...currentContext, panel: prev ?? PanelType.Question });
    };

    return (
      <div className="flex flex-col gap-4 justify-start items-center h-full">
          <div>{question?.description}</div>
          <div>
              <button onClick={returnToSurvey} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200">
                  <ArrowUturnLeftIcon className="size-5" />
                  <span>Close</span>
              </button>
          </div>
      </div>
    );
};
