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
                    <div className="w-full px-2 py-4 flex flex-col gap-4 bg-neutral-background border border-neutral-border rounded-lg">
                        {getPanel()}
                    </div>
                </div>
            </div>
            <PostToaster key="toaster" toasts={toasts} removeToast={removeToast} />
        </div>
    );
};

/*
                        <div className="text-xl font-bold text-neutral-content-strong">This is for the question title text.</div>
                        <div>Optional question description <img width="250px" src="snoo-facepalm.png" /></div>
                        <div className="flex flex-col gap-2">
                            {rows.map((r, i) =>
                                <div key={i} className={`p-2 cursor-pointer flex items-center bg-neutral-background-strong group ring rounded-lg ${i === 4 ? 'ring-reddit-lime' : 'ring-neutral-border hover:ring-reddit-lime-secondary'}`}>
                                    <div className={`size-6 flex items-center ${i === 4 ? 'text-reddit-lime' : 'group-hover:text-reddit-lime-secondary'}`}><BulletIcon fill={i === 4} /></div>
                                    <div>This is a row {r}.{i === 8 ? (<img width="250px" src="snoo-facepalm.png" />) : null}</div>
                                </div>)
                            }
                        </div>
                        <div className="text-xs">
                            <button className="cursor-pointer hover:underline">Clear Selection</button>
                        </div>
                        <div className="flex justify-between flex-wrap gap-x-2 gap-y-4">
                            <div className="flex items-center gap-2 order-2 xs:order-1">
                                <button className="flex gap-1 items-center cursor-pointer rounded-lg p-2 border border-neutral-border text-secondary-plain hover:text-secondary-onbackground hover:bg-secondary-background-hovered">
                                    <ArrowLeftIcon className="size-5" />
                                    <span>Previous</span>
                                </button>
                                <button className="flex gap-1 items-center cursor-pointer rounded-lg p-2 border border-neutral-border text-secondary-plain hover:text-secondary-onbackground hover:bg-secondary-background-hovered">
                                    <PresentationChartBarIcon className="size-5" />
                                    <span>Results</span>
                                </button>
                            </div>
                            <div className="flex-1 order-1 xs:order-2 basis-full xs:basis-0 flex flex-col gap-1 justify-center items-center text-sm">
                                <div>Question 1 of 3</div>
                                <div className="relative w-full max-w-50 h-1.5 rounded-full bg-neutral-border-weak">
                                    <div className="absolute inset-0 w-[33%] h-full rounded-full bg-survey-button-primary-background"></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 order-3">
                                <button className={`flex gap-1 items-center p-2 text-survey-button-primary-onbackground bg-survey-button-primary-background hover:bg-survey-button-primary-background-hovered disabled:text-secondary-onbackground disabled:bg-secondary-background disabled:font-normal rounded-xl cursor-pointer`}>
                                    <span>Next</span>
                                    <ArrowRightIcon className="size-5" />
                                </button>
                            </div>
                        </div>
                    </div>
 */
