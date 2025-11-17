/*!
* The content displayed if there is an error loading the survey context.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

export const ErrorPanel = () => {

    const ctx = useContext(SurveyContext);

    const gotoPrev = () => {
        if (!ctx) return;
        const { prev, ...currentContext } = ctx.panelContext;
        ctx.setPanelContext({ ...currentContext, panel: prev ?? PanelType.Intro });
    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center h-full">
            <img className="w-1/2" src="snoo-facepalm.png" alt="Snoo Error" />
            <div className="text-xl text-center">Sorry, there was an error loading the survey. Please try again later.</div>
            {ctx?.panelContext?.prev !== undefined && (
                <div>
                    <button onClick={gotoPrev} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200">
                        <ArrowUturnLeftIcon className="size-5" />
                        <span>Back</span>
                    </button>
                </div>
            )}
        </div>
    );
};
