/*!
* A panel to display the description text of a question, similar to a modal, when the text is too long.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext, useEffect, useRef, useState } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import { IntroHelp } from './help/IntroHelp';

export const HelpPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    // Create a ref for the contents div. Needed to have page scrolling.
    const contDiv = useRef<HTMLDivElement | null>(null);
    const [contScroll, setContScroll] = useState<[boolean, boolean] | null>(null);

    // Effect to show/hide scroll buttons based on rendered result size
    useEffect(() => {
        const div = contDiv?.current;
        setContScroll(!div || div.scrollHeight == div.clientHeight ? null : [
            div.scrollTop > 0,
            div.scrollTop < div.scrollHeight - div.clientHeight
        ]);
    }, [ctx.panelContext]);

    const scrollContent = (factor: number) => {
        const div = contDiv?.current;
        if (!div) return;
        div.scrollTop = div.scrollTop + div.clientHeight * factor;
        setContScroll([
            div.scrollTop > 0,
            div.scrollTop < div.scrollHeight - div.clientHeight
        ]);
    };

    const returnToSurvey = () => {
        const { prev, ...currentContext } = ctx.panelContext;
        ctx.setPanelContext({ ...currentContext, panel: prev ?? PanelType.Intro });
    };

    return (
      <div className="flex flex-col gap-4 justify-start items-center h-full">
          <div className="relative flex-grow h-[0%] w-full p-2">
              <div ref={contDiv} className="h-full overflow-hidden">
                  {
                      (() => {
                          switch (ctx.panelContext.panel) {
                              default:
                                  return (<IntroHelp />);
                          }
                      })()
                  }
              </div>
              {contScroll && (
                  <div className="absolute top-0 right-0 h-full flex flex-col justify-between items-center">
                      <button onClick={() => scrollContent(-0.5)} disabled={!contScroll?.[0]} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200 disabled:pointer-events-none disabled:opacity-25">
                          <ArrowUpCircleIcon className="size-5" />
                      </button>
                      <button onClick={() => scrollContent(0.5)} disabled={!contScroll?.[1]} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200 disabled:pointer-events-none disabled:opacity-25">
                          <ArrowDownCircleIcon className="size-5" />
                      </button>
                  </div>
              )}
          </div>
          <div>
              <button onClick={returnToSurvey} className="flex gap-1 items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200">
                  <ArrowUturnLeftIcon className="size-5" />
                  <span>Close</span>
              </button>
          </div>
      </div>
    );
};
