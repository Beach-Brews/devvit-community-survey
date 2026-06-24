/*!
* Helper methods for managing expanded mode in Devvit.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { getWebViewMode, requestExpandedMode } from '@devvit/web/client';
import { useCallback, useContext, MouseEvent } from 'react';
import { SurveyContext, SurveyPanelContext } from '../post/SurveyContext';

export const getSurveyWebviewMode = () => {
    try {
        return getWebViewMode();
    } catch (_) {
        return window.location.search === '' ? 'inline' : 'expanded';
    }
};

export const getPostPanelState = (surveyId: string | undefined) => {
    if (!window.localStorage || !surveyId) return null;
    const storageKey = `${surveyId}:panelState`;
    const value = window.localStorage.getItem(storageKey);
    if (!value) return null;
    const parsed = JSON.parse(value);
    const panelContext: SurveyPanelContext = {
        panel: parsed.panel
    };
    if (parsed.number !== undefined) panelContext.number = parsed.number;
    if (parsed.prev !== undefined) panelContext.prev = parsed.prev;
    if (parsed.showResultNav !== undefined) panelContext.showResultNav = parsed.showResultNav;
    window.localStorage.removeItem(storageKey);
    return panelContext;
};

export const useOpenExpandedMode = (
    update: ((state: SurveyPanelContext) => SurveyPanelContext) | SurveyPanelContext,
) => {
    const ctx = useContext(SurveyContext);

    if (!ctx) {
        throw new Error('useOpenExpandedMode must be used inside ExpandedContextProvider');
    }

    return useCallback(
        (event: MouseEvent<HTMLButtonElement>) => {

            const expandedMode = ctx.expandedMode;
            ctx.setPanelContext((prev) => {
                const next = typeof update === 'function'
                    ? update(prev) : update;

                if (!expandedMode && window.localStorage) {
                    window.localStorage.setItem(
                        `${ctx.survey.id}:panelState`,
                        JSON.stringify(next),
                    );
                }

                return next;
            });

            if (expandedMode) return;

            requestExpandedMode(event.nativeEvent as PointerEvent, 'default');
            ctx.setExpandedMode(true);
        },
        [ctx, update],
    );
};
