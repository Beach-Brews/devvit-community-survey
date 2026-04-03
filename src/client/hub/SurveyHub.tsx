/*!
* A component that lists all surveys on the sub.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { MouseEvent, useCallback, useEffect, useState } from 'react';
import { requestExpandedMode } from '@devvit/web/client';
import { SubDefaultIcon } from '../shared/components/CustomIcons';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { InitializeHubResponse } from '../../shared/types/postApi';
import { initializeHub } from './api/hubApi';
import { Pagination } from '../../shared/types/api';
import { SurveyDto } from '../../shared/redis/SurveyDto';
import { SurveyHubCard } from './SurveyHubCard';
import { LoadingSpinner } from '../shared/components/LoadingSpinner';

type HubFilter = 'live' | 'closed' | 'all';

type HubPagination = Pagination & {
    filter: HubFilter;
    surveys: SurveyDto[];
};

export const SurveyHub = () => {

    // Initialize the pagination object
    const [pagination, setPagination] = useState<HubPagination>(() => {
        return {
            filter: 'live',
            page: 1,
            pageSize: 3,
            total: 0,
            surveys: []
        };
    });

    // Helper method for setting the pagination state
    const updatePagination = useCallback((allSurveys: SurveyDto[], filter?: HubFilter, page?: number) => {
        setPagination(p => {
            const now = Date.now();
            filter = filter ?? p.filter;
            page = page ?? p.page;

            const live = filter === 'live';
            const filtered = filter === 'all'
                ? allSurveys
                : allSurveys.filter(s => live
                    ? (s.closeDate == null || s.closeDate > now)
                    : (s.closeDate && s.closeDate <= now)
                );
            return {
                filter: filter,
                page: page,
                pageSize: 3,
                total: filtered.length,
                surveys: filtered
                    .slice((page-1)*3, page*3)
            };
        })
    }, []);

    // Initialize the hub data (surveys, sub, etc.)
    const [hubInit, setHubInit] = useState<InitializeHubResponse | null | undefined>(undefined);
    useEffect(() => {
        const initHub = async () => {
            try {
                const data = await initializeHub();
                setHubInit(data);
                if (data?.surveys && data.surveys.length > 0) {
                    const now = Date.now();
                    const hasLive = !!data.surveys.find(s => !s.closeDate || s.closeDate > now);
                    updatePagination(data.surveys, hasLive ? 'live' : 'all');
                }
            } catch (e) {
                console.log('[CommunitySurvey] Hub init error: ', e);
                setHubInit(null);
            }
        };
        void initHub();
    }, [updatePagination]);

    const launchDashboard = useCallback((e: MouseEvent) => {
        requestExpandedMode(e.nativeEvent as PointerEvent, 'dashboard');
    }, []);

    // Handle loading or error
    if (!hubInit) {
        return (
            <div className="flex flex-col gap-4 justify-center items-center h-full">
                {hubInit === undefined
                    ? (
                        <>
                            <LoadingSpinner className="bg-rl-text-weak dark:bg-rd-text-weak" />
                            <div className="text-xl text-center">Loading Survey Hub...</div>
                        </>
                    )
                    : (
                        <>
                            <img className="w-1/2" src="snoo-facepalm.png" alt="Snoo Error" />
                            <div className="text-xl text-center">Sorry, there was an error loading the Survey Hub. Please try again later.</div>
                        </>
                    )
                }
            </div>
        );
    }

    const allowDashboard = hubInit.user.isMod || hubInit.user.allowDev || false;

    return (
        <div className="w-full h-screen overflow-auto">
            <div className="container max-w-screen-lg min-h-screen mx-auto flex flex-col relative z-0 h-full">
                <div className="flex justify-between items-center flex-wrap gap-2 p-2">
                    <div className="flex justify-start items-center flex-wrap gap-2">
                        <div  className="w-8 h-8 flex-shrink-0 object-contain overflow-hidden rounded-full">
                            {hubInit.subInfo.icon ? (<img width={32} height={32} alt={hubInit.subInfo.name} src={hubInit.subInfo.icon} />) : (<SubDefaultIcon />)}
                        </div>
                        <h1 className="text-md lg:text-2xl font-bold">r/{hubInit.subInfo.name} Surveys</h1>
                    </div>
                    {allowDashboard && (
                        <button
                            className="rounded-full h-10 px-4 ml-auto font-semibold text-sm cursor-pointer flex justify-center items-center text-white bg-rl-btn-primary dark:bg-rd-btn-primary"
                            onClick={launchDashboard}
                        >
                            Launch Dashboard
                        </button>
                    )}
                </div>
                {/* No Surveys */}
                {hubInit && hubInit.surveys.length <= 0
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
                                <button
                                    onClick={() => updatePagination(hubInit.surveys, 'live', 1)}
                                    className={`min-w-16.25 rounded-full px-4 h-8 cursor-pointer ${pagination.filter === 'live' ? 'bg-rl-btn-sec-selected dark:bg-rd-btn-sec-selected' : 'hover:bg-rl-btn-sec-hover hover:dark:bg-rd-btn-sec-hover'}`}
                                >
                                    Live
                                </button>
                                <button
                                    onClick={() => updatePagination(hubInit.surveys, 'closed', 1)}
                                    className={`min-w-16.25 rounded-full px-4 h-8 cursor-pointer ${pagination.filter === 'closed' ? 'bg-rl-btn-sec-selected dark:bg-rd-btn-sec-selected' : 'hover:bg-rl-btn-sec-hover hover:dark:bg-rd-btn-sec-hover'}`}
                                >
                                    Closed
                                </button>
                                <button
                                    onClick={() => updatePagination(hubInit.surveys, 'all', 1)}
                                    className={`min-w-16.25 rounded-full px-4 h-8 cursor-pointer ${pagination.filter === 'all' ? 'bg-rl-btn-sec-selected dark:bg-rd-btn-sec-selected' : 'hover:bg-rl-btn-sec-hover hover:dark:bg-rd-btn-sec-hover'}`}
                                >
                                    All
                                </button>
                            </div>
                            <div className="flex justify-end items-center gap-2">
                                <div>{(pagination.page-1)*pagination.pageSize+1}-{Math.min(pagination.page*pagination.pageSize, pagination.total)} of {pagination.total}</div>
                                <button
                                    disabled={pagination.page <= 1}
                                    onClick={() => { if(pagination.page > 1) updatePagination(hubInit.surveys, undefined, pagination.page-1); }}
                                    className="p-2 flex justify-center rounded-full cursor-pointer disabled:pointer-events-none disabled:opacity-50 hover:bg-rl-btn-sec-hover hover:dark:bg-rd-btn-sec-hover"
                                >
                                    <ChevronLeftIcon className="size-5" />
                                </button>
                                <button
                                    disabled={pagination.page >= pagination.total/pagination.pageSize}
                                    onClick={() => { if(pagination.page < pagination.total/pagination.pageSize) updatePagination(hubInit.surveys, undefined, pagination.page+1); }}
                                    className="p-2 flex justify-center rounded-full cursor-pointer disabled:pointer-events-none disabled:opacity-50 hover:bg-rl-btn-sec-hover hover:dark:bg-rd-btn-sec-hover"
                                >
                                    <ChevronRightIcon className="size-5" />
                                </button>
                            </div>
                        </div>
                        <div className="relative grow h-[0%]">
                            <div className="flex flex-col gap-1 p-1 h-full overflow-hidden">
                                {pagination.surveys.length > 0
                                    ? pagination.surveys.map(s => <SurveyHubCard key={s.id} survey={s} />)
                                    : (
                                        <div>
                                            There are no {pagination.filter === 'live' ? 'Live' : 'Closed'} surveys.
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
