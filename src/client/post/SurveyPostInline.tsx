/*!
* Display when in inline-mode.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext, useState } from 'react';
import { PanelType, SurveyContext } from './SurveyContext';
import { PostToaster } from './PostToaster';
import { SubDefaultIcon } from '../shared/components/CustomIcons';
import { DeletePanel } from './panels/DeletePanel';
import { ClosedPanel } from './panels/ClosedPanel';
import { IntroPanel } from './panels/IntroPanel';
import { OutroPanel } from './panels/OutroPanel';

export const SurveyPostInline = () => {
    // Assert context
    const ctx = useContext(SurveyContext);
    if (!ctx) throw Error('Context undefined.');
    const { user, survey, panelContext, subInfo, toasts, removeToast, anonymousMode } = ctx;

    // Get render date (calculate now closed or not)
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();

    // Prevents default URL from changing on re-rendering
    const [defaultSnoo] = useState<string>(() => `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`);

    // Determine the panel to render
    const getPanel = () => {

        // If the survey is now closed
        if (survey.closeDate && survey.closeDate <= now)
            return panelContext.panel === PanelType.Delete
                ? (<DeletePanel />)
                : (<ClosedPanel />);

        // Otherwise, load from context
        switch (panelContext.panel) {
            case PanelType.Outro: return (<OutroPanel />);
            case PanelType.Delete: return (<DeletePanel />);
            case PanelType.Intro:
            default:
                return (<IntroPanel isAnonymous={!user?.userId} responseBlocked={user?.responseBlocked} />);
        }
    };

    return (
        <div className="h-full max-h-full flex flex-col justify-between">
            <div className="grow h-[0%]">
                {getPanel()}
            </div>
            <footer className="w-full p-2 border-t border-t-neutral-border text-xs flex justify-between items-center">
                <div className="w-3/7 flex gap-1 items-center">
                    {subInfo && (
                            <>
                                <div  className="w-8 h-8 shrink-0 object-contain overflow-hidden rounded-full">
                                    {subInfo.icon ? (<img width={32} height={32} alt={subInfo.name} src={subInfo.icon} />) : (<SubDefaultIcon />)}
                                </div>
                                r/{subInfo.name}
                            </>
                        )
                    }
                </div>
                <div className="w-1/7 flex flex-col justify-center items-center">
                    {survey && user?.allowDev === true
                        ? (
                            <div className="text-center text-[0.7rem] text-neutral-content-weak">
                                {panelContext.panel == PanelType.Question || panelContext.panel == PanelType.QuestionDescription || panelContext.panel == PanelType.Result
                                    ? panelContext?.number !== undefined
                                        ? survey.id + ' ' + (survey.questions?.[panelContext.number]?.id ?? `Q${panelContext.number} ??`)
                                        : survey.id + ' QNaN'
                                    : survey.id
                                }
                            </div>
                        ) : undefined
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
                    {!user?.userId && (
                        <>
                            Anonymous <img src={defaultSnoo} alt="default snoovar" className="w-8 h-8 rounded-full" />
                        </>
                    )}
                </div>
            </footer>
            <PostToaster key="toaster" toasts={toasts} removeToast={removeToast} />
        </div>
    );
};
