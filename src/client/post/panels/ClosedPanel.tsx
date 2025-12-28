/*!
* The panel displayed to a user when survey has been closed.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';

export const ClosedPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    // Get number of responses from user
    const responses = ctx.lastResponse ? Object.keys(ctx.lastResponse).length : 0;

    const showResults = () => {
        ctx.setPanelContext({ panel: PanelType.Result, number: 0, prev: PanelType.Intro, showResultNav: true });
    };

    const onDelete = () => {
        ctx.setPanelContext({ panel: PanelType.Delete, prev: PanelType.Intro });
    };

    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full">
          <div className="text-xl text-center">
              This survey has closed and is no longer accepting responses.
          </div>
          {ctx.canViewResults
              ? (
                  <button onClick={showResults} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl cursor-pointer`}>
                      View Results
                  </button>
              )
              : (
                  <button disabled={true} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl cursor-pointer disabled:cursor-not-allowed`}>
                      View Results <span className="text-[0.75rem]">(Mods Only)</span>
                  </button>
              )
          }
          {responses > 0 && (
              <div className="mt-8 w-full flex justify-center">
                  <button onClick={onDelete} className="w-2/3 max-w-[300px] text-white bg-red-800 dark:bg-red-900 px-8 py-2 rounded-xl cursor-pointer">
                      Delete Response
                  </button>
              </div>
          )}
      </div>
    );
};
