/*!
* Component for Survey Response expanded view.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SubDefaultIcon } from '../shared/components/CustomIcons';
import { PanelType, SurveyContext } from './SurveyContext';
import { useContext, useState } from 'react';
import { PostToaster } from './PostToaster';
import { HelpPanel } from './panels/HelpPanel';
import { ResultPanel } from './panels/ResultPanel';
import { DeletePanel } from './panels/DeletePanel';
import { ClosedPanel } from './panels/ClosedPanel';
import { IntroPanel } from './panels/IntroPanel';
import { QuestionPanel } from './panels/QuestionPanel';
import { OutroPanel } from './panels/OutroPanel';
import { ErrorPanel } from './panels/ErrorPanel';

export const SurveyPostExpanded = () => {

    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');
    const { subInfo, user, survey, toasts, removeToast, anonymousMode, panelContext, canViewResults } = ctx;

    // Get render date (calculate now closed or not)
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();

    // Prevents default URL from changing on re-rendering
    const [defaultSnoo] = useState<string>(() => `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`);

    // Determine the panel to render
    const getPanel = () => {

        // Always allow help panel
        if (panelContext.panel === PanelType.Help)
            return (<HelpPanel />);

        // If the survey is now closed
        if (survey.closeDate && survey.closeDate <= now)
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
            default:
                console.error(`[Survey Post] - Unknown panel type: ${panelContext.panel}`);
                return (<ErrorPanel />);
        }
    };

    /*
    const openHelp = () => {
        setPanelContext(cc => {
            return {
                panel: cc.prev !== undefined && cc.panel === PanelType.Help ? cc.prev : PanelType.Help,
                number: cc.number ?? -1,
                prev: cc.panel
            };
        });
    };
    */


    return (
        <div className="h-full flex flex-col">
            <div className="h-10 shrink-0 bg-devvit-expanded-header border-b border-b-neutral-border dark:border-none">
                <div className="max-w-175 h-full mx-auto flex justify-between items-center px-2 gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        {subInfo && (
                            <>
                                <div  className="w-5 h-5 shrink-0 object-contain overflow-hidden rounded-full">
                                    {subInfo.icon ? (<img width={32} height={32} alt={subInfo.name} src={subInfo.icon} />) : (<SubDefaultIcon />)}
                                </div>
                                r/{subInfo.name}
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
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
                        {!user?.userId && (
                            <>
                                Anonymous <img src={defaultSnoo} alt="default snoovar" className="w-8 h-8 rounded-full" />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="max-w-175 mx-auto p-2 pt-4">
                    <div className="w-full px-2 py-4 flex flex-col gap-4 bg-neutral-background border border-neutral-border rounded-xl">
                        {getPanel()}
                    </div>
                </div>
            </div>
            <PostToaster key="toaster" toasts={toasts} removeToast={removeToast} />
        </div>
    );
};
