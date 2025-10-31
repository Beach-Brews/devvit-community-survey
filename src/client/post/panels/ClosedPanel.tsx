/*!
* Once a survey is closed, this is the panel that is displayed.
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
            <div className="text-xl text-center">This survey is no longer accepting responses.</div>
        </div>
    );
};
