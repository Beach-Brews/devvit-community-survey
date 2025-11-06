/*!
* The panel displayed to a user when survey has been closed.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { SurveyContext } from '../SurveyContext';

export const ClosedPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full">
          <div className="text-xl text-center">
              This survey has closed and is no longer accepting responses.
          </div>
          <button className={`w-2/3 max-w-[300px] text-white bg-blue-800 dark:bg-blue-900 disabled:bg-neutral-600 disabled:dark:bg-neutral-900 px-8 py-2 rounded-xl cursor-pointer`}>
              View Results
          </button>
      </div>
    );
};
