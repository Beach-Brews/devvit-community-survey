/*!
* The last panel displayed to a user.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { ResultVisibility } from '../../../shared/redis/SurveyDto';

export const OutroPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    const showResults = () => {
        ctx.setPanelContext({ panel: PanelType.Result, number: 0, prev: PanelType.Outro, showResultNav: true });
    };

    const restartSurvey = () => {
        ctx.setPanelContext({ panel: PanelType.Question, number: 0 });
    };

    const onDelete = () => {
        ctx.setPanelContext({ panel: PanelType.Delete, prev: PanelType.Outro });
    };

    const outroText = ctx.survey.outro;

    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full">
          <div className={`${outroText.length > 180 ? 'text-base' : 'text-xl'} text-center`}>{outroText && outroText.length > 0 ? outroText : 'Thank you for your response.'}</div>
          <button onClick={restartSurvey} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl cursor-pointer`}>
              Change Responses
          </button>
          {ctx.canViewResults
              ? (
                  <button onClick={showResults} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl cursor-pointer`}>
                      View Results
                  </button>
              )
              : (
                  <button disabled={true} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl cursor-pointer disabled:cursor-not-allowed`}>
                      View Results <span className="text-[0.75rem]">
                        {ctx.survey.resultVisibility === ResultVisibility.Closed ? '(Once Closed)' : '(Mods Only)'}
                      </span>
                  </button>
              )
          }
          <div className="w-full flex justify-center">
              <button onClick={onDelete} className="w-2/3 max-w-[300px] text-white bg-red-800 dark:bg-red-900 px-8 py-2 rounded-xl cursor-pointer">
                  Delete Response
              </button>
          </div>
      </div>
    );
};
