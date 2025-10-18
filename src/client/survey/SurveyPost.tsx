/*!
* Survey inline view for taking surveys directly in Reddit feeds.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useEffect, useState } from 'react';
import { SurveyWithQuestionsDto } from '../../shared/redis/SurveyDto';
import { getPostSurvey } from './api/surveyApi';
import { PanelType, SurveyContext, SurveyContextProps, SurveyPanelContext } from './SurveyContext';
import { LoadingPanel } from './panels/LoadingPanel';
import { ErrorPanel } from './panels/ErrorPanel';
import { IntroPanel } from './panels/IntroPanel';
import { QuestionPanel } from './panels/QuestionPanel';
import { OutroPanel } from './panels/OutroPanel';

export const SurveyPost = () => {

    // State for loading survey context
    const [panelContext, setPanelContext] = useState<SurveyPanelContext>({panel: PanelType.Intro});
    const [survey, setSurvey] = useState<SurveyWithQuestionsDto | null | undefined>(undefined);

    // Load survey from backend
    useEffect(() => {
        const callApi = async () => {
            const survey = await getPostSurvey();
            setSurvey(survey);
        };
        void callApi();
    }, []);

    // Ensure context is only defined if the survey is defined
    const context: SurveyContextProps | undefined = survey
        ? { panelContext, setPanelContext, survey }
        : undefined;

    // Determine the panel to render
    const getPanel = () => {
        // If loading (survey undefined) show loading
        if (survey === undefined)
            return (<LoadingPanel />);

        // If there was an error (survey null) show error
        if (survey === null)
            return (<ErrorPanel />);

        // Otherwise, load from context
        switch (panelContext.panel) {
            case PanelType.Intro: return (<IntroPanel />);
            case PanelType.Question: return (<QuestionPanel />);
            case PanelType.Outro: return (<OutroPanel />);
            default: throw new Error(`Unknown panel type: ${panelContext.panel}`);
        }
    };

    return (
        <SurveyContext value={context}>
            <div className="p-4 h-full">
                {getPanel()}
            </div>
        </SurveyContext>
    );
};
