/*!
* The last panel displayed to a user.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';

export const OutroPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    const showResults = () => {
        ctx.setPanelContext({ panel: PanelType.Result, number: 0, prev: PanelType.Outro, showResultNav: true });
    };

    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full">
          <div className="text-xl text-center">{ctx.survey.outro}</div>
          <button onClick={showResults} className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl cursor-pointer`}>
              View Results
          </button>
      </div>
    );
};
