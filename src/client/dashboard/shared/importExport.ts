/*!
* Helper functions for handling importing and exporting surveys.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyDto, SurveyWithQuestionsDto } from '../../../shared/redis/SurveyDto';
import { ChangeEvent } from 'react';
import { genSurveyId } from '../../../shared/redis/uuidGenerator';
import { DashboardContextProps } from '../DashboardContext';
import { ToastType } from '../../shared/toast/toastTypes';
import * as surveyDashboardApi from '../api/dashboardApi';

export const exportSurvey = async (survey: SurveyDto | SurveyWithQuestionsDto) => {
    // Remove some properties for exports
    const replacer = (key: string, value: unknown) => {
        if (key === 'id' || key === 'value' || key === 'owner' || key === 'postId' || key === 'responseCount' || key.indexOf('Date') >= 0) return undefined;
        return value;
    };

    // Stringify with the replacer
    const exportedSurvey = JSON.stringify(survey, replacer, 2);

    // Convert to a blob and generate a data URL
    const blob = new Blob([exportedSurvey], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Generate the file name from survey title (strip special characters, limit to 30 characters)
    let fileName = survey.title.replace(/\s+/g, '-')
        .replace(/[^A-Za-z0-9-_]/g, '')
        .replace(/--*/g, '-');
    if (fileName.length > 30)
        fileName = fileName.substring(0, 30);

    // Create a temporary "download" anchor
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName + '.survey');
    link.style.display = 'none';

    // Add the link and trigger a click to start the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const importSurvey = async (event: ChangeEvent<HTMLInputElement>, ctx: DashboardContextProps) => {
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
                const text = typeof content === 'string'
                    ? content
                    : (new TextDecoder()).decode(content);

                // Parse the file contents as JSON
                const parsed = JSON.parse(text);

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
};
