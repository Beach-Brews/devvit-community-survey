/*!
* Handles scheduling the publishing of a survey.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyDto } from '../../../../shared/redis/SurveyDto';
import { DashboardModal } from '../../shared/components/DashboardModal';
import { ChangeEvent, useCallback, useContext, useState } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { saveSurvey } from '../../api/dashboardApi';
import { DashboardContext } from '../../DashboardContext';
import { BulletIcon } from '../../../shared/components/CustomIcons';

export interface SurveyEditorPublishModalProps {
    survey: SurveyDto;
}

export interface SurveyEditorPublishModalState {
    processing: boolean;
    error: boolean;
}

interface SurveyPublishOptionsState {
    immediate: boolean;
    scheduleDateInput: string;
    scheduleDate: number;
    noCloseDate: boolean;
    closeDateInput: string;
    closeDate: number;
}

export const SurveyEditorPublishModal = (props: SurveyEditorPublishModalProps) => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const setModal = ctx.setModal;
    const setPageContext = ctx.setPageContext;

    const [options, setOptions] = useState<SurveyPublishOptionsState>({
        immediate: true,
        scheduleDateInput: new Date().toLocaleString(),
        scheduleDate: Date.now(),
        noCloseDate: true,
        closeDateInput: new Date(Date.now() + (7 * 24 * 60 * 60000)).toLocaleString(),
        closeDate: Date.now() + (7 * 24 * 60 * 60000)
    });

    const survey = props.survey;
    const [state, setState] = useState<SurveyEditorPublishModalState>({
        processing: false,
        error: false
    });
    const onAccept = useCallback(async () => {
        try {
            setState({ processing: true, error: false });

            if (!options.immediate) {
                if (isNaN(options.scheduleDate)) {
                    setState({ processing: false, error: true });
                    return false;
                }

                survey.publishDate = options.scheduleDate;

            } else {
                survey.publishDate = Date.now();
            }

            // BUG: Check to make sure the close date is AFTER the publish date
            // Maybe set a "min-open" period / time too?
            if (!options.noCloseDate) {
                if (isNaN(options.closeDate)) {
                    setState({ processing: false, error: true });
                    return false;
                }

                survey.closeDate = options.closeDate;

            } else {
                survey.closeDate = null;
            }

            const saved = await saveSurvey(survey);

            setState({ processing: false, error: !saved });
            setModal(undefined);
            setPageContext({page: 'list'});

            return saved;
        } catch(e) {
            setState({ processing: false, error: true });
        }
        return false;
    }, [survey, options, setModal, setPageContext]);

    const title = (
        <div className="flex items-center gap-2"><CalendarDaysIcon className="size-6" /> Publish Survey</div>
    );

    const onPublishOptionChange = (isImmediate: boolean) => {
        setOptions(s => {
            return s.immediate != isImmediate ? { ...s, immediate: isImmediate } : s;
        });
    };

    const onPublishDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setOptions(s => {
            return { ...s, scheduleDateInput: e.target.value, scheduleDate: new Date(e.target.value).getTime() };
        });
    };

    const onCloseOptionChange = (isNoClose: boolean) => {
        setOptions(s => {
            return s.noCloseDate != isNoClose ? { ...s, noCloseDate: isNoClose } : s;
        });
    };

    const onCloseDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setOptions(s => {
            return { ...s, closeDateInput: e.target.value, closeDate: new Date(e.target.value).getTime() };
        });
    };

    return (
        <DashboardModal
            type="confirm"
            title={title}
            processing={state.processing}
            confirmLabel={options.immediate ? 'Publish Now' : 'Publish Later'}
            onAccept={onAccept}
            disableAccept={(!options.immediate && isNaN(options.scheduleDate) || (!options.noCloseDate && isNaN(options.closeDate)))}
        >
            {state.processing ? (
                <div>Please wait...</div>
            ) : (
                <div className="text-lg flex flex-col gap-2">
                    <div>Are you should you want to publish this survey?</div>
                    <div className="p-2 bg-neutral-200 dark:bg-neutral-800">
                        {props.survey.title}
                    </div>
                    <div className="mt-6 text-xl font-bold">
                        Publish Date
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="w-full flex gap-4 items-center cursor-pointer" onClick={() => onPublishOptionChange(true)}>
                            <BulletIcon fill={options.immediate} />
                            Immediately
                        </div>
                        <div className="w-full flex gap-4 cursor-pointer" onClick={() => onPublishOptionChange(false)}>
                            <BulletIcon fill={!options.immediate} />
                            <div>Future Date</div>
                            <div>
                                <input
                                    onFocus={() => onPublishOptionChange(false)}
                                    onChange={onPublishDateChange}
                                    value={options.scheduleDateInput}
                                    className={`p-2 border-1 rounded-sm border-neutral-500 focus:border-1 focus:outline-1 focus:outline-black dark:focus:outline-white${options.immediate ? ' opacity-50' : ''}`}
                                />
                                <div className={`${options.immediate ? 'opacity-50' : (isNaN(options.scheduleDate) ? ' text-red-600 dark:text-red-400' : '')}`}>{new Date(options.scheduleDate).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-xl font-bold">
                        Close Date
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="w-full flex gap-4 items-center cursor-pointer" onClick={() => onCloseOptionChange(true)}>
                            <BulletIcon fill={options.noCloseDate} />
                            No Close
                        </div>
                        <div className="w-full flex gap-4 cursor-pointer" onClick={() => onCloseOptionChange(false)}>
                            <BulletIcon fill={!options.noCloseDate} />
                            <div>Future Date</div>
                            <div>
                                <input
                                    onFocus={() => onCloseOptionChange(false)}
                                    onChange={onCloseDateChange}
                                    value={options.closeDateInput}
                                    className={`p-2 border-1 rounded-sm border-neutral-500 focus:border-1 focus:outline-1 focus:outline-black dark:focus:outline-white${options.noCloseDate ? ' opacity-50' : ''}`}
                                />
                                <div className={`${options.noCloseDate ? 'opacity-50' : (isNaN(options.closeDate) ? ' text-red-600 dark:text-red-400' : '')}`}>{new Date(options.closeDate).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="font-bold text-red-600 dark:text-red-400">
                        Once published and live, you will not be able to edit this survey.
                    </div>
                    {state.error && (
                        <div className="p-2 bg-red-200 dark:bg-red-900">
                            Sorry, there was an error publishing the survey.
                        </div>
                    )}
                </div>
            )}
        </DashboardModal>
    );
};
