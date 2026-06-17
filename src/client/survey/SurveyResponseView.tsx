/*!
* Component for Survey Response expanded view.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { BulletIcon, SubDefaultIcon } from '../shared/components/CustomIcons';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { PresentationChartBarIcon } from '@heroicons/react/24/outline';

export const SurveyResponseView = () => {
    const rows: number[] = [];
    for (let i=0; i<5; ++i) { rows.push(i); }
    const anonymousMode = true;
    return (
        <div className="h-full flex flex-col">
            <div className="h-12 shrink-0 bg-neutral-background-weak">
                <div className="max-w-175 h-full mx-auto flex justify-between items-center px-2 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <div className="size-8"><SubDefaultIcon /></div>
                        <span>r/CommunitySurvey</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="text-right">
                            <div className={anonymousMode ? "line-through opacity-30" : ""}>u/Beach-Brews</div>
                            <div className={!anonymousMode ? "line-through opacity-30" : ""}>Anonymous</div>
                        </div>
                        <div  className={`size-8 object-contain overflow-hidden rounded-full ${anonymousMode ? "opacity-30" : ""}`}>
                            <img src="https://i.redd.it/snoovatar/avatars/39b6f849-b2de-4c8f-9c97-4946152dc878.png" alt={`snoovar for Beach-Brews`} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
                <div className="max-w-175 mx-auto p-2 pt-4">
                    <div className="w-full px-2 py-4 flex flex-col gap-4 bg-neutral-background border border-neutral-border rounded-lg">
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
                </div>
            </div>
        </div>
    );
};
