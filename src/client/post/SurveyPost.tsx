/*!
* Survey inline view for taking surveys directly in Reddit feeds.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useEffect, useState } from 'react';
import { initializeSurvey } from './api/surveyApi';
import { PanelType, SurveyContext, SurveyContextProps, SurveyPanelContext } from './SurveyContext';
import { LoadingPanel } from './panels/LoadingPanel';
import { ErrorPanel } from './panels/ErrorPanel';
import { IntroPanel } from './panels/IntroPanel';
import { QuestionPanel } from './panels/QuestionPanel';
import { OutroPanel } from './panels/OutroPanel';
import { navigateTo } from '@devvit/web/client';
import { Constants } from '../../shared/constants';
import { ClosedPanel } from './panels/ClosedPanel';
import { UserResponsesDto } from '../../shared/redis/ResponseDto';
import { InitializeSurveyResponse } from '../../shared/types/postApi';
import { ResultPanel } from './panels/ResultPanel';
import { DeletePanel } from './panels/DeletePanel';
import { QuestionDescriptionPanel } from './panels/QuestionDescriptionPanel';

export const SurveyPost = () => {

    // State for loading survey context
    const [panelContext, setPanelContext] = useState<SurveyPanelContext>({panel: PanelType.Intro});
    const [postInit, setPostInit] = useState<InitializeSurveyResponse | null | undefined>(undefined);
    const [lastResponse, setLastResponse] = useState<UserResponsesDto | undefined>(undefined);
    const survey = postInit?.survey;
    const user = postInit?.user;

    // Prevents default URL from changing on re-rendering
    const [defaultSnoo] = useState<string>(`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`);

    // Load survey from backend
    useEffect(() => {
        const callApi = async () => {
            try {
                const postInit = await initializeSurvey();
                setPostInit(postInit);
                setLastResponse(postInit?.lastResponse);
            } catch (error) {
                console.error('[Survey Post] Failed to load survey: ', error);
                setPostInit(null);
            }
        };
        void callApi();
    }, []);

    // Ensure context is only defined if the survey is defined
    const context: SurveyContextProps | undefined = survey
        ? { panelContext, setPanelContext, survey, lastResponse, setLastResponse }
        : undefined;

    // Determine the panel to render
    const getPanel = () => {
        // If loading (survey undefined) show loading
        if (postInit === undefined)
            return (<LoadingPanel />);

        // If there was an error (survey null) show error
        if (postInit === null || !survey)
            return (<ErrorPanel />);

        // If the survey is now closed
        if (survey.closeDate && survey.closeDate <= Date.now())
            return panelContext.panel === PanelType.Result
                ? (<ResultPanel />)
                : panelContext.panel === PanelType.Delete
                    ? (<DeletePanel />)
                    : (<ClosedPanel />);

        // Otherwise, load from context
        switch (panelContext.panel) {
            case PanelType.Intro: return (<IntroPanel isAnonymous={!user?.userId} />);
            case PanelType.Question: return (<QuestionPanel key={`pnl_${panelContext.number}`} />);
            case PanelType.Outro: return (<OutroPanel />);
            case PanelType.Result: return (<ResultPanel />);
            case PanelType.Delete: return (<DeletePanel />);
            case PanelType.QuestionDescription: return (<QuestionDescriptionPanel />);
            default:
                console.error(`[Survey Post] - Unknown panel type: ${panelContext.panel}`);
                return (<ErrorPanel />);
        }
    };

    return (
        <SurveyContext value={context}>
            <div className="h-full max-h-full flex flex-col justify-between">
                <div className="p-2 flex-grow h-[0%]">
                    {getPanel()}
                </div>
                <footer className="w-full p-2 pt-0 text-xs flex justify-between">
                    <div className="w-1/2 flex gap-1 items-center">
                        {user?.userId && (
                            <>
                                <div  className="w-8 h-8 object-contain overflow-hidden rounded-full"><img src={user?.snoovar !== undefined && user.snoovar.length > 0 ? user.snoovar : defaultSnoo} alt={`snoovar for ${user.username}`} /></div> {user.username}
                            </>
                        )}
                        {postInit && !user?.userId && (
                            <>
                                <img src={defaultSnoo} alt="default snoovar" className="w-8 h-8 rounded-full" /> Anonymous
                            </>
                        )}
                        {postInit === undefined && (
                            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/2 animate-pulse "></div>
                        )}
                    </div>
                    <div className="w-1/2 flex flex-col items-end justify-end">
                        <div><span className="underline cursor-pointer" onClick={() => navigateTo("https://www.reddit.com/r/CommunitySurvey")}>r/CommunitySurvey</span></div>
                        <div className="text-[0.7rem] text-neutral-600 dark:text-neutral-400" >{Constants.SURVEY_VERSION_DISPLAY}</div>
                    </div>
                </footer>
            </div>
        </SurveyContext>
    );
};
