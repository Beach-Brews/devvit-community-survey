/*!
* The intro to start a survey. This displays to a user if they have not started/responded to a
* survey yet.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';

export const IntroPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    // Handler for starting survey
    const onStartSurvey = () => {
        ctx.setPanelContext({ panel: PanelType.Question, number: 0 });
    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center h-full">
            <div className="text-4xl font-bold">{ctx.survey.title}</div>
            <div className="text-xl text-center">{ctx.survey.intro}</div>
            <div className="mt-8 w-full flex justify-center">
                <button onClick={onStartSurvey} className="w-1/2 bg-blue-100 dark:bg-blue-900 px-8 py-2 rounded-xl cursor-pointer">
                    Start Survey
                </button>
            </div>
        </div>
    );
};
