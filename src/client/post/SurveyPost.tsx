/*!
* Entrypoint into survey response view.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useEffect, useRef, useState } from 'react';
import { initializeSurvey } from './api/surveyApi';
import { PanelType, SurveyContext, SurveyContextProps, SurveyPanelContext } from './SurveyContext';
import { context, addWebViewModeListener, removeWebViewModeListener } from '@devvit/web/client';
import { UserResponsesDto } from '../../shared/redis/ResponseDto';
import { InitializeSurveyResponse } from '../../shared/types/postApi';
import { useToaster } from '../shared/toast/useToaster';
import { ResultVisibility } from '../../shared/redis/SurveyDto';
import { getPostPanelState, getSurveyWebviewMode } from '../shared/expandedStateManager';
import { SurveyPostInline } from './SurveyPostInline';
import { SurveyPostExpanded } from './SurveyPostExpanded';
import { LoadingPanel } from './panels/LoadingPanel';

export const SurveyPost = () => {

    // Determine if post is deleted (based on post data)
    // @ts-expect-error - Bug with native apps having the developerData object
    const surveyId = context?.postData?.developerData?.surveyId ??
        context?.postData?.surveyId;
    const isDeleted = surveyId === 'deleted';

    // Get render date (calculate now closed or not)
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();

    // State for loading survey context
    const [expandedMode, setExpandedMode] = useState<boolean>(getSurveyWebviewMode() == 'expanded');
    const [panelContext, setPanelContext] = useState<SurveyPanelContext>({panel: PanelType.Intro});
    const [postInit, setPostInit] = useState<InitializeSurveyResponse | null | undefined>(undefined);
    const [lastResponse, setLastResponse] = useState<UserResponsesDto | null | undefined>(undefined);
    const [toasts, addToast, removeToast] = useToaster();
    const [anonymousMode, setAnonymousMode] = useState<boolean>(true);
    const survey = postInit?.survey;
    const user = postInit?.user;
    const subInfo = postInit?.subInfo;

    // Ref for overriding theme variables
    const surveyPostContainer = useRef<HTMLDivElement>(null);

    // Attach listener for window expanded state
    useEffect(() => {
        if (getSurveyWebviewMode() === 'expanded') return;

        const listener = (newMode: 'expanded' | 'inline') => {
            if (newMode === 'inline')
                window.location.reload();
        };
        addWebViewModeListener(listener);
        return () => {
            removeWebViewModeListener(listener);
        };
    }, []);

    // Load survey from backend
    useEffect(() => {
        if (isDeleted) return;
        const callApi = async () => {
            try {
                const postInit = await initializeSurvey();

                const panelCtx = getPostPanelState(postInit?.survey.id);
                if (panelCtx) {
                    setPanelContext(panelCtx);
                }

                setPostInit(postInit);
                setLastResponse(postInit?.lastResponse);

                // Override theme variables
                const container = surveyPostContainer.current;
                const theme = postInit?.survey.theme?.primaryColor;
                if (!container || !theme) return;
                const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                container.style.setProperty('--survey-primary-border', `var(--reddit-${theme})`);
                container.style.setProperty('--survey-primary-border-hovered', `var(--reddit-${theme}-${isDarkMode ? 'secondary' : 'dark'})`);
                container.style.setProperty('--survey-button-primary-background', `var(--reddit-${theme})`);
                container.style.setProperty('--survey-button-primary-background-hovered', `var(--reddit-${theme}-secondary)`);
                container.style.setProperty('--color-survey-primary-border', `var(--reddit-${theme})`);
                container.style.setProperty('--color-survey-primary-border-hovered', `var(--reddit-${theme}-${isDarkMode ? 'secondary' : 'dark'})`);
                container.style.setProperty('--color-survey-button-primary-background', `var(--reddit-${theme})`);
                container.style.setProperty('--color-survey-button-primary-background-hovered', `var(--reddit-${theme}-secondary)`);

            } catch (error) {
                console.error('[Survey Post] Failed to load survey: ', error);
                setPostInit(null);
            }
        };
        void callApi();
    }, [isDeleted]);

    // If the survey was deleted
    if (isDeleted)
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-full">
                <div className="text-xl text-center">This survey has been deleted by a moderator.</div>
            </div>
        );

    // Determine if user can view responses
    const canViewResults = (
        (user && user.isMod) ||
        (survey && (survey.resultVisibility ?? ResultVisibility.Always) === ResultVisibility.Always) ||
        (survey && lastResponse && Object.keys(lastResponse).length >= survey.questions.length && survey.resultVisibility === ResultVisibility.Responders) ||
        (!!survey?.closeDate && survey.closeDate <= now && survey.resultVisibility === ResultVisibility.Closed)
    );

    // Ensure context is only defined if the survey is defined
    const surveyContext: SurveyContextProps | undefined = survey
        ? { panelContext, setPanelContext, survey, user, subInfo, lastResponse, setLastResponse, toasts, addToast, removeToast, canViewResults, anonymousMode, setAnonymousMode, expandedMode, setExpandedMode }
        : undefined;

    return (
        <SurveyContext.Provider value={surveyContext}>
            <div className="h-full" ref={surveyPostContainer}>
                {postInit
                    ? (expandedMode ? <SurveyPostExpanded /> : <SurveyPostInline />)
                    : <LoadingPanel />
                }
            </div>
        </SurveyContext.Provider>
    );
};
