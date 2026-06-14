/*!
* A panel to confirm response deletion.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { PanelType, SurveyContext } from '../SurveyContext';
import { deleteResponses } from '../api/surveyApi';
import { ToastType } from '../../shared/toast/toastTypes';
import { TrashIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';

export const DeletePanel = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');

    const returnToSurvey = () => {
        ctx.setPanelContext({ ...ctx.panelContext, panel: PanelType.Intro });
    };

    const onDelete = async () => {
        try {
            await deleteResponses();
            ctx.setLastResponse(null);
            returnToSurvey();
        } catch(e) {
            ctx.addToast({
                message: 'Failed to delete responses',
                type: ToastType.Error
            });
        }
    };

    return (
      <div className="p-2 flex flex-col gap-4 justify-center items-center h-full">
          <div className="text-center font-bold text-lg">Delete Responses</div>
          <div className="text-center">Are you sure you wish to delete all of your responses to this survey?</div>
          <div className="flex gap-4 justify-center items-center w-full">
              <button onClick={returnToSurvey} className="w-1/3 flex justify-center items-center bg-secondary-background text-secondary-onbackground hover:bg-secondary-background-hovered p-2 rounded-xl cursor-pointer">
                  <XMarkIcon className="size-4" />
                  <span>Cancel</span>
              </button>
              <button onClick={onDelete} className="w-1/3 flex justify-center items-center gap-1 bg-danger-background text-danger-onbackground hover:bg-danger-background-hovered p-2 rounded-xl cursor-pointer">
                  <TrashIcon className="size-4" /><span>DELETE</span>
              </button>
          </div>
      </div>
    );
};
