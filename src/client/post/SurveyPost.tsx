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
import { InitializeSurveyResponse } from '../../shared/types/postApi';

export const SurveyPost = () => {

    // State for loading survey context
    const [panelContext, setPanelContext] = useState<SurveyPanelContext>({panel: PanelType.Intro});
    const [postInit, setPostInit] = useState<InitializeSurveyResponse | null | undefined>(undefined);
    const survey = postInit?.survey;
    const user = postInit?.user;

    // Prevents default URL from changing on re-rendering
    const [anonymousRandom] = useState<number>(Math.floor(Math.random() * 8));

    // Load survey from backend
    useEffect(() => {
        const callApi = async () => {
            try {
                const postInit = await initializeSurvey();
                setPostInit(postInit);
            } catch (error) {
                console.error('[Survey Post] Failed to load survey: ', error);
                setPostInit(null);
            }
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
        if (postInit === undefined)
            return (<LoadingPanel />);

        // If there was an error (survey null) show error
        if (postInit === null || !survey)
            return (<ErrorPanel />);

        // If the survey is now closed
        if (survey.closeDate && survey.closeDate <= Date.now())
            return (<ClosedPanel />);

        // Otherwise, load from context
        switch (panelContext.panel) {
            case PanelType.Intro: return (<IntroPanel isAnonymous={!user?.userId} />);
            case PanelType.Question: return (<QuestionPanel key={`pnl_${panelContext.number}`} />);
            case PanelType.Outro: return (<OutroPanel />);
            default: throw new Error(`Unknown panel type: ${panelContext.panel}`);
        }
    };

    return (
        <SurveyContext value={context}>
            <div className="h-full max-h-full flex flex-col justify-between">
                <div className="p-2 flex-grow h-[0%]">
                    {getPanel()}
                </div>
                <footer className="w-full p-2 text-xs flex justify-between">
                    <div className="w-1/2 flex gap-1 items-center">
                        {user?.userId && (
                            <>
                                <img src={user.snoovar} alt={`snoovar for ${user.username}`} className="w-8 h-8 rounded-full" /> {user.username}
                            </>
                        )}
                        {postInit !== null && !user?.userId && (
                            <>
                                <img src={`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${anonymousRandom}.png`} alt="default snoovar" className="w-8 h-8 rounded-full" /> Anonymous
                            </>
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
