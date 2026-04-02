/*!
* A component that lists all surveys on the sub.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { requestExpandedMode } from '@devvit/web/client';
import { SubDefaultIcon } from '../shared/components/CustomIcons';
import { DocumentArrowDownIcon, PresentationChartBarIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon, NoSymbolIcon, RssIcon } from '@heroicons/react/24/solid';
import { SurveyDto } from '../../shared/redis/SurveyDto';
import { InitializeHubResponse } from '../../shared/types/postApi';
import { initializeHub } from './api/hubApi';

export interface SurveyHubCardProps {
    title: string;
    description: string;
    live: boolean;
    results: string;
    close: string;
}
export const SurveyHubCard = (props: SurveyHubCardProps) => {
    return (
        <div className="flex flex-col gap-2 px-2 py-1 cursor-pointer hover:bg-rl-section-hover hover:dark:bg-rd-section-hover rounded-md border border-rl-border-weak dark:border-rd-border-weak">
            <div className="flex flex-nowrap text-nowrap gap-1 items-center text-sm">
                {props.live
                    ? (
                        <>
                            <div className="text-green-700 dark:text-green-300">LIVE</div>
                            <RssIcon className="size-3" />
                        </>
                    )
                    : (
                        <>
                            <div className="text-rose-700 dark:text-rose-300">CLOSED</div>
                            <NoSymbolIcon className="size-3" />
                        </>
                    )
                }
                <div>&bull;</div>
                <PresentationChartBarIcon className="size-3" />
                <div>{props.results}</div>
                <div>&bull;</div>
                <DocumentArrowDownIcon className="size-3" />
                <div>{props.close}</div>
            </div>
            <div className={`text-base font-semibold text-rl-text dark:text-rd-text ${props.live ? "" : "line-clamp-1"}`}>{props.title}</div>
            <div className={props.live ? "line-clamp-2" : "line-clamp-1"}>{props.description}</div>
        </div>
    );
};

type HubPagination = {
    filter: 'live' | 'closed' | 'all';
    page: number;
    pageSize: number;
    total: number;
};

export const SurveyHub = () => {

    // Initialize the pagination object
    const [pagination, setPagination] = useState<HubPagination>(() => {
        return {
            filter: 'live',
            page: 1,
            pageSize: 3,
            total: 0
        };
    });

    // Initialize the hub data (surveys, sub, etc.)
    const [init, setInit] = useState<InitializeHubResponse | null | undefined>(undefined);
    useEffect(() => {
        const initHub = async () => {
            try {
                const data = await initializeHub();
                setInit(data);
                setPagination(p => { return { ...p, total: data?.surveys.length ?? 0 }; });
            } catch (e) {
                console.log('[CommunitySurvey] Hub init error: ', e);
                setInit(null);
            }
        };
        void initHub();
    }, []);

    const launchDashboard = useCallback((e: MouseEvent) => {
        requestExpandedMode(e.nativeEvent as PointerEvent, 'dashboard');
    }, []);

    // If loading, show loading screen
    if (!init) {
        return (
            <div>
                {init === undefined ? 'Loading...' : 'Error!'}
            </div>
        );
    }

    return (
        <div className="w-full h-screen overflow-auto">
            <div className="container max-w-screen-lg min-h-screen mx-auto flex flex-col relative z-0 h-full">
                <div className="flex justify-between items-center flex-wrap gap-2 p-2">
                    <div className="flex justify-start items-center flex-wrap gap-2">
                        <SubDefaultIcon />
                        <h1 className="text-md lg:text-2xl font-bold">r/UAT4CommunitySurvey21 Surveys</h1>
                    </div>
                    <button className="rounded-full h-10 px-4 ml-auto font-semibold text-sm cursor-pointer flex justify-center items-center text-white bg-rl-btn-primary dark:bg-rd-btn-primary" onClick={launchDashboard}>Launch Dashboard</button>
                </div>
                {/* No Surveys */}
                {surveys && surveys.length <= 0
                    ? (
                        <div className="flex flex-col gap-2 p-2 justify-center items-center border-t border-t-rl-border-weak dark:border-t-rd-border-weak">
                            <div className="texf-xl sm:text-2xl text-rl-text dark:text-rd-text font-bold text-center">There are no surveys currently</div>
                            <div className="text-center">Check back soon!</div>
                        </div>
                    )
                    : (
                    <>
                        {/* Pagination + Survey List */}
                        <div className="flex justify-between items-center p-2 gap-2 border-b border-b-rl-border-weak dark:border-b-rd-border-weak">
                            <div className="flex justify-start items-center gap-2">
                                <button className="min-w-16.25 rounded-full px-4 h-8 cursor-pointer hover:bg-rl-btn-sec-hover hover:dark:bg-rd-btn-sec-hover">Live</button>
                                <button className="min-w-16.25 rounded-full px-4 h-8 cursor-pointer hover:bg-rl-btn-sec-hover hover:dark:bg-rd-btn-sec-hover">Closed</button>
                                <button className="min-w-16.25 rounded-full px-4 h-8 cursor-pointer bg-rl-btn-sec-selected dark:bg-rd-btn-sec-selected">All</button>
                            </div>
                            <div className="flex justify-end items-center gap-2">
                                <div>1-3 of 7</div>
                                <button className="p-2 flex justify-center rounded-full cursor-pointer hover:bg-rl-btn-sec-hover hover:dark:bg-rd-btn-sec-hover"><ChevronLeftIcon className="size-5" /></button>
                                <button className="p-2 flex justify-center rounded-full cursor-pointer hover:bg-rl-btn-sec-hover hover:dark:bg-rd-btn-sec-hover"><ChevronRightIcon className="size-5" /></button>
                            </div>
                        </div>
                        <div className="relative grow h-[0%]">
                            <div className="flex flex-col gap-1 p-1 h-full overflow-hidden">
                                {surveys}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
