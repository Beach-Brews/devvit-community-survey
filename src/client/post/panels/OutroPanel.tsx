/*!
* The last panel displayed to a user.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { SurveyContext } from '../SurveyContext';

export const OutroPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full">
          <div className="text-xl text-center">{ctx.survey.outro}</div>
      </div>
    );
};
