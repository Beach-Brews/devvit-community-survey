/*!
* The panel displayed to a user when survey has been closed.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useCallback, useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { ResultVisibility } from '../../../shared/redis/SurveyDto';
import { PresentationChartBarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useOpenExpandedMode } from '../../shared/expandedStateManager';

export const ClosedPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    // Get number of responses from user
    const responses = ctx.lastResponse ? Object.keys(ctx.lastResponse).length : 0;

    const showResults = useOpenExpandedMode(useCallback(() => ({
        panel: PanelType.Result, number: 0, prev: PanelType.Intro, showResultNav: true
    }), []));

    const onDelete = () => {
        ctx.setPanelContext({ panel: PanelType.Delete, prev: PanelType.Intro });
    };

    return (
      <div className="p-2 flex flex-col gap-4 justify-center items-center h-full">
          <div className="text-xl text-center font-bold">
              {ctx.survey.title}
          </div>
          <div className="text-center">
              This survey has closed and is no longer accepting responses.
          </div>
          {ctx.canViewResults
              ? (
                  <button onClick={showResults} className="w-2/3 max-w-75 svy-btn-primary">
                      <PresentationChartBarIcon className="size-4" />
                      <div>View Results</div>
                  </button>
              )
              : (
                  <button disabled={true} className="w-2/3 max-w-75 svy-btn-primary">
                      <div className="flex justify-center items-center gap-1">
                          <PresentationChartBarIcon className="size-4" />
                          <div>View Results</div>
                      </div>
                      <div className="text-[0.75rem]">
                          {ctx.survey.resultVisibility === ResultVisibility.Responders ? '(Responders only) ': '(Mods Only)'}
                      </div>
                  </button>
              )
          }
          {responses > 0 && (
              <div className="mt-8 w-full flex justify-center">
                  <button onClick={onDelete} className="w-2/3 max-w-75 svy-btn-danger">
                      <TrashIcon className="size-4" /> Delete Responses
                  </button>
              </div>
          )}
      </div>
    );
};
