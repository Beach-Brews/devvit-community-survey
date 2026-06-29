/*!
* The last panel displayed to a user.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useCallback, useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { ResultVisibility } from '../../../shared/redis/SurveyDto';
import { renderMarkdown } from '../../shared/markdown/markdownFlavor';
import { PencilSquareIcon, PresentationChartBarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useOpenExpandedMode } from '../../shared/expandedStateManager';

export const OutroPanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    const showResults = useOpenExpandedMode(useCallback(() => ({
        panel: PanelType.Result, number: 0, prev: PanelType.Outro, showResultNav: true
    }), []));

    const restartSurvey = useOpenExpandedMode(useCallback(() => ({
        panel: PanelType.Question, number: 0
    }), []));

    const onDelete = () => {
        ctx.setPanelContext({ panel: PanelType.Delete, prev: PanelType.Outro });
    };

    const outroText = ctx.survey.outro;

    return (
      <div className="p-2 flex flex-col gap-4 justify-center items-center h-full">
          <div className={`${outroText.length > 180 ? 'text-base line-clamp-8' : 'text-xl'} text-center`}>{outroText && outroText.length > 0 ? renderMarkdown(outroText) : 'Thank you for your response.'}</div>
          <button onClick={restartSurvey} className="w-2/3 max-w-75 svy-btn-primary">
              <PencilSquareIcon className="size-4" />
              <div>Change Responses</div>
          </button>
          {ctx.canViewResults || ctx.survey.resultVisibility === ResultVisibility.Responders
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
                        {ctx.survey.resultVisibility === ResultVisibility.Closed ? '(Once Closed)' : '(Mods Only)'}
                      </div>
                  </button>
              )
          }
          <div className="w-full flex justify-center">
              <button onClick={onDelete}  className="w-2/3 max-w-75 svy-btn-danger">
                  <TrashIcon className="size-4" /> Delete Responses
              </button>
          </div>
      </div>
    );
};
