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
            returnToSurvey();
        } catch(e) {
            ctx.addToast({
                message: 'Failed to delete responses',
                type: ToastType.Error
            });
        }
    };

    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full">
          <div className="text-center font-bold text-lg">Delete Responses</div>
          <div className="text-center">Are you sure you wish to delete all of your responses to this survey?</div>
          <div className="flex gap-4 justify-center items-center w-full">
              <button onClick={returnToSurvey} className="w-1/3 text-white bg-blue-800 dark:bg-blue-900 px-8 py-2 rounded-xl cursor-pointer">
                  <span>Cancel</span>
              </button>
              <button onClick={onDelete} className="w-1/3 text-white bg-red-800 dark:bg-red-900 px-8 py-2 rounded-xl cursor-pointer">
                  <span>DELETE</span>
              </button>
          </div>
      </div>
    );
};
