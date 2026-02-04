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
import { context } from '@devvit/web/client';
import { ClosedPanel } from './panels/ClosedPanel';
import { UserResponsesDto } from '../../shared/redis/ResponseDto';
import { InitializeSurveyResponse } from '../../shared/types/postApi';
import { ResultPanel } from './panels/ResultPanel';
import { DeletePanel } from './panels/DeletePanel';
import { QuestionDescriptionPanel } from './panels/QuestionDescriptionPanel';
import { useToaster } from '../shared/toast/useToaster';
import { PostToaster } from './PostToaster';
import { ResultVisibility } from '../../shared/redis/SurveyDto';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { HelpPanel } from './panels/HelpPanel';
import { SubDefaultIcon } from '../shared/components/CustomIcons';

export const SurveyPost = () => {

    // Determine if post is deleted (based on post data)
    // @ts-expect-error - Bug with native apps having the developerData object
    const surveyId = context?.postData?.developerData?.surveyId ??
        context?.postData?.surveyId;
    const isDeleted = surveyId === 'deleted';

    // State for loading survey context
    const [panelContext, setPanelContext] = useState<SurveyPanelContext>({panel: PanelType.Intro});
    const [postInit, setPostInit] = useState<InitializeSurveyResponse | null | undefined>(undefined);
    const [lastResponse, setLastResponse] = useState<UserResponsesDto | null | undefined>(undefined);
    const [toasts, addToast, removeToast] = useToaster();
    const [anonymousMode, setAnonymousMode] = useState<boolean>(true);
    const survey = postInit?.survey;
    const user = postInit?.user;

    // Prevents default URL from changing on re-rendering
    const [defaultSnoo] = useState<string>(`https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`);

    // Load survey from backend
    useEffect(() => {
        if (isDeleted) return;
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
    }, [isDeleted]);

    // Determine if user can view responses
    const canViewResults = (
        (user && user.isMod) ||
        (survey && (survey.resultVisibility ?? ResultVisibility.Always) === ResultVisibility.Always) ||
        (survey && lastResponse && Object.keys(lastResponse).length >= survey.questions.length && survey.resultVisibility === ResultVisibility.Responders) ||
        (!!survey?.closeDate && survey.closeDate <= Date.now() && survey.resultVisibility === ResultVisibility.Closed)
    );

    // Ensure context is only defined if the survey is defined
    const surveyContext: SurveyContextProps | undefined = survey
        ? { panelContext, setPanelContext, survey, lastResponse, setLastResponse, addToast, canViewResults, anonymousMode, setAnonymousMode }
        : undefined;

    // Determine the panel to render
    const getPanel = () => {

        // If the survey was deleted
        if (isDeleted)
            return (
                <div className="flex flex-col gap-4 justify-center items-center h-full">
                    <div className="text-xl text-center">This survey has been deleted.</div>
                </div>
            );

        // If loading (survey undefined) show loading
        if (postInit === undefined)
            return (<LoadingPanel />);

        // If there was an error (survey null) show error
        if (postInit === null || !survey)
            return (<ErrorPanel />);

        // Always allow help panel
        if (panelContext.panel === PanelType.Help)
            return (<HelpPanel />);

        // If the survey is now closed
        if (survey.closeDate && survey.closeDate <= Date.now())
            return panelContext.panel === PanelType.Result && canViewResults
                ? (<ResultPanel />)
                : panelContext.panel === PanelType.Delete
                    ? (<DeletePanel />)
                    : (<ClosedPanel />);

        // Otherwise, load from context
        switch (panelContext.panel) {
            case PanelType.Intro: return (<IntroPanel isAnonymous={!user?.userId} responseBlocked={user?.responseBlocked} />);
            case PanelType.Question: return (<QuestionPanel key={`pnl_${panelContext.number}`} />);
            case PanelType.Outro: return (<OutroPanel />);
            case PanelType.Result: return canViewResults
                ? (<ResultPanel />)
                : (<ErrorPanel />);
            case PanelType.Delete: return (<DeletePanel />);
            case PanelType.QuestionDescription: return (<QuestionDescriptionPanel />);
            default:
                console.error(`[Survey Post] - Unknown panel type: ${panelContext.panel}`);
                return (<ErrorPanel />);
        }
    };

    const openHelp = () => {
        setPanelContext(cc => {
            return {
                panel: cc.prev !== undefined && cc.panel === PanelType.Help ? cc.prev : PanelType.Help,
                number: cc.number ?? -1,
                prev: cc.panel
            };
        });
    };

    return (
        <SurveyContext value={surveyContext}>
            <div className="h-full max-h-full flex flex-col justify-between">
                <div className="p-2 flex-grow h-[0%]">
                    {getPanel()}
                </div>
                <footer className="w-full p-2 pt-0 text-xs flex justify-between items-center">
                    <div className="w-3/7 flex gap-1 items-center">
                        {postInit?.subInfo === undefined
                            ? (
                                <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/2 animate-pulse "></div>
                            )
                            : (
                                <>
                                    <div  className="w-8 h-8 flex-shrink-0 object-contain overflow-hidden rounded-full">
                                        {postInit.subInfo.icon ? (<img width={32} height={32} alt={postInit.subInfo.name} src={postInit.subInfo.icon} />) : (<SubDefaultIcon />)}
                                    </div>
                                    r/{postInit.subInfo.name}
                                </>
                            )
                        }
                    </div>
                    <div className="w-1/7 flex flex-col justify-center items-center">
                        {survey && user?.allowDev === true
                            ? (
                                <div className="text-center text-[0.7rem] text-neutral-600 dark:text-neutral-400">
                                    {panelContext.panel == PanelType.Question || panelContext.panel == PanelType.QuestionDescription || panelContext.panel == PanelType.Result
                                        ? panelContext?.number !== undefined
                                            ? survey.id + ' ' + (survey.questions?.[panelContext.number]?.id ?? `Q${panelContext.number} ??`)
                                            : survey.id + ' QNaN'
                                        : survey.id
                                    }
                                </div>
                            ) : postInit !== undefined
                                ? (
                                    <button onClick={openHelp} className="hidden flex gap-1 justify-center items-center cursor-pointer rounded-lg p-2 hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-900 hover:dark:text-blue-200">
                                        <QuestionMarkCircleIcon className="size-4" />
                                        <span>Help</span>
                                    </button>
                                ) : (
                                    <div className="h-4 bg-neutral-300 rounded-full dark:bg-neutral-700 w-3/4 annimate-pulse"></div>
                                )
                        }
                    </div>
                    <div className="w-3/7 flex gap-1 items-center justify-end">
                        {user?.userId && (
                            <>
                                <div className="text-right">
                                    <div className={anonymousMode ? "line-through opacity-30" : ""}>u/{user.username}</div>
                                    <div className={!anonymousMode ? "line-through opacity-30" : ""}>Anonymous</div>
                                </div>
                                <div  className={`w-8 h-8 object-contain overflow-hidden rounded-full ${anonymousMode ? "opacity-30" : ""}`}>
                                    <img src={user?.snoovar !== undefined && user.snoovar.length > 0 ? user.snoovar : defaultSnoo} alt={`snoovar for ${user.username}`} />
                                </div>
                            </>
                        )}
                        {postInit && !user?.userId && (
                            <>
                                Anonymous <img src={defaultSnoo} alt="default snoovar" className="w-8 h-8 rounded-full" />
                            </>
                        )}
                        {postInit === undefined && (
                            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/2 animate-pulse "></div>
                        )}
                    </div>
                </footer>
                <PostToaster key="toaster" toasts={toasts} removeToast={removeToast} />
            </div>
        </SurveyContext>
    );
};
