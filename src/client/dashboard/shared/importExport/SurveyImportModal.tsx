/*!
* Modal allowing the user to paste or upload an exported Survey configuration.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { DashboardModal } from '../components/DashboardModal';
import { ChangeEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DashboardContext } from '../../DashboardContext';
import { ToastType } from '../../../shared/toast/toastTypes';
import { genSurveyId } from '../../../../shared/redis/uuidGenerator';
import * as surveyDashboardApi from '../../api/dashboardApi';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

export const SurveyImportModal = () => {

    // Confirm context exists
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const importUpload = useRef<HTMLInputElement | null>(null);
    const importArea = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (!importArea?.current) return;
        importArea.current.focus();
    }, [importArea]);

    const [surveyConfig, setSurveyConfig] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);

    const importConfig = useCallback(async () => {
        try {
            setProcessing(true);

            // Parse the file contents as JSON
            const parsed = JSON.parse(surveyConfig);

            // Generate a new survey ID and set the ID
            const surveyId = genSurveyId();
            parsed.id = surveyId;

            // Send data to general Save endpoint (which will create the survey)
            await surveyDashboardApi.saveSurvey(parsed);

            // Toast success and navigate to the editor page
            ctx.addToast({
                message: 'Import Successful',
                type: ToastType.Success
            });
            ctx.setPageContext({
                page: 'edit',
                surveyId: surveyId
            });
            return true;
        } catch (error) {
            console.error('[CommunitySurvey] Import Failed: ', error);
            ctx.addToast({
                heading: 'Import Error',
                message: 'Failed to import survey',
                type: ToastType.Error,
            });
        }
        setProcessing(false);
        return false;
    }, [ctx, surveyConfig, setProcessing]);

    const uploadSurvey = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        // Helper for showing a toast if the import fails.
        const failToast = () => {
            ctx.addToast({
                heading: 'Import Error',
                message: 'Failed to import survey',
                type: ToastType.Error
            });
        };

        try {
            // First, get input file value
            const file = event.target.files && event.target.files[0]
            if (!file) {
                event.target.value = '';
                return;
            }

            // Create a file reader to read provided file
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    // Get the contents of the file from the reader
                    const content = e.target?.result;
                    if (!content) return failToast();

                    // If content is not a string, use a text decoder to get the contents as a string.
                    const text = typeof content === 'string' ? content : new TextDecoder().decode(content);

                    setSurveyConfig(text);

                    // // Parse the file contents as JSON
                    // const parsed = JSON.parse(text);
                    //
                    // // Generate a new survey ID and set the ID
                    // const surveyId = genSurveyId();
                    // parsed.id = surveyId;
                    //
                    // // Send data to general Save endpoint (which will create the survey)
                    // await surveyDashboardApi.saveSurvey(parsed);
                    //
                    // // Toast success and navigate to the editor page
                    // ctx.addToast({
                    //     message: 'Import Successful',
                    //     type: ToastType.Success
                    // });
                    // ctx.setPageContext({
                    //     page: 'edit',
                    //     surveyId: surveyId
                    // });
                    // ctx.setModal(undefined);
                } catch (e) {
                    failToast();
                }
            };
            reader.readAsText(file);
            event.target.value = '';

        } catch (e) {
            failToast();
        }

        event.target.value = '';
    }, [ctx, setSurveyConfig]);

    return (
        <DashboardModal
            type="confirm"
            title="Import Survey"
            confirmLabel="Import"
            cancelLabel="Cancel"
            onAccept={importConfig}
            disableAccept={!surveyConfig || processing}
        >
            <div className={`h-full max-h-full flex flex-col justify-between gap-4 ${processing ? 'opacity-50 pointer-events-none' : ''}`}>
                <input
                    className="hidden"
                    ref={importUpload}
                    id="import-file"
                    type="file"
                    accept="text/plain, application/json, .survey"
                    onChange={(e) => uploadSurvey(e)}
                />
                <div>
                    <button
                        className="flex gap-2 items-center cursor-pointer dark:text-white px-2 py-1 rounded-lg text-small hover:bg-neutral-300 hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:border-neutral-500"
                        onClick={() => importUpload.current?.click()}
                    >
                        <ArrowUpTrayIcon className="size-6" />
                        <div>Import From File <span className="text-sm">(.txt, .json, .survey)</span></div>
                    </button>
                </div>
                <textarea
                    ref={importArea}
                    className="w-full h-[60vh] border-1 rounded-md p-2"
                    value={surveyConfig}
                    readOnly={processing}
                    placeholder="Paste a previously exported survey configuration here."
                    onChange={(e) => setSurveyConfig(e.target.value)}
                ></textarea>
            </div>
        </DashboardModal>
    );
};
