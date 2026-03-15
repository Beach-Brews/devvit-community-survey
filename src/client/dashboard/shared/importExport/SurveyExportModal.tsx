/*!
* Modal allowing the user to copy an exported Survey configuration.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { DashboardModal } from '../components/DashboardModal';
import { useContext, useEffect, useRef } from 'react';
import { DashboardContext } from '../../DashboardContext';
import { ToastType } from '../../../shared/toast/toastTypes';

export interface SurveyExportModalProps {
    survey: string;
}

export const SurveyExportModal = (props: SurveyExportModalProps) => {

    // Confirm context exists
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const exportArea = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (!exportArea?.current) return;
        exportArea.current.focus();
        exportArea.current.select();
    }, [exportArea]);

    const copyConfig = async () => {
        try {
            if (exportArea?.current) {
                exportArea.current.focus();
                exportArea.current.select();
            }

            await navigator.clipboard.writeText(props.survey);

            ctx.addToast({
                heading: 'Survey Copied',
                message: 'The survey config has been copied to your clipboard. Open the import screen to paste the config, or save it to a file for later use.',
                type: ToastType.Success,
                time: 10000
            });
            return true;

        } catch (_) {
            ctx.addToast({
                message: 'Failed to copy the survey config to your device clipboard. Please copy manually from above.',
                type: ToastType.Error
            });
        }
        return false;
    };

    return (
        <DashboardModal
            type="confirm"
            title="Export Survey"
            confirmLabel="Copy & Close"
            cancelLabel="Close"
            onAccept={copyConfig}
        >
            <textarea ref={exportArea} className="w-[75vw] h-[75vh] border-1 rounded-md p-2" readOnly={true} value={props.survey}></textarea>
        </DashboardModal>
    );
};
