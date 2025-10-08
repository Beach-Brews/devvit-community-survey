/*!
* Handles the deleting of a survey.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyDto } from '../../../../shared/redis/SurveyDto';
import { DashboardModal } from '../../shared/components/DashboardModal';
import { useCallback, useContext, useState } from 'react';
import { StopCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { closeSurveyById, deleteSurveyById } from '../../api/dashboardApi';
import { DashboardContext } from '../../DashboardContext';

export interface SurveyDeleteConfirmModalProps {
    survey: SurveyDto;
    action: 'delete' | 'close';
    updateSurveyList: () => Promise<void>;
}
export interface SurveyDeleteConfirmModalState {
    processing: boolean;
    error: boolean;
}

export const SurveyDeleteConfirmModal = (props: SurveyDeleteConfirmModalProps) => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const setModal = ctx.setModal;

    const surveyId = props.survey.id;
    const isClose = props.action === 'close';
    const updateSurveyList = props.updateSurveyList;
    const [state, setState] = useState<SurveyDeleteConfirmModalState>({
        processing: false,
        error: false
    });
    const onAccept = useCallback(async () => {
        try {
            setState({ processing: true, error: false });
            const deleted = isClose
                ? await closeSurveyById(surveyId)
                : await deleteSurveyById(surveyId);
            setState({ processing: false, error: !deleted });
            if (deleted) {
                setModal(undefined);
                void updateSurveyList();
            }
            return deleted;
        } catch(e) {
            setState({ processing: false, error: true });
        }
        return false;
    }, [surveyId, isClose, setModal, updateSurveyList]);

    const title = isClose
        ? (<div className="flex items-center gap-2"><StopCircleIcon className="size-6" /> Confirm Close Survey</div>)
        : (<div className="flex items-center gap-2"><TrashIcon className="size-6" /> Confirm Delete Survey</div>);

    return (
        <DashboardModal
            type="destroy"
            title={title}
            processing={state.processing}
            onAccept={onAccept}
            confirmLabel={isClose ? 'Close' : 'Delete'}
        >
            {state.processing ? (
                <div>Please wait...</div>
            ) : (
                <div className="text-lg flex flex-col gap-2">
                    <div>Are you should you want to {isClose ? 'close' : 'delete'} this survey?</div>
                    <div className="p-2 bg-neutral-200 dark:bg-neutral-800">
                        {props.survey.title}
                    </div>
                    <div className="font-bold text-red-600 dark:text-red-400">
                        This action cannot be undone!
                    </div>
                    {state.error && (
                        <div className="p-2 bg-red-200 dark:bg-red-900">
                            Sorry, there was an error {isClose ? 'closing' : 'deleting'} the survey.
                        </div>
                    )}
                </div>
            )}
        </DashboardModal>
    );
};
