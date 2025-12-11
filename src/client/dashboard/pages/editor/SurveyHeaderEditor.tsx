/*!
* Editor for survey title, intro, and other settings.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { DefaultResponderCriteria, ResponderCriteriaDto, SurveyDto } from '../../../../shared/redis/SurveyDto';
import { KeyboardEvent, ChangeEvent, Dispatch, FocusEvent, SetStateAction, useState, useEffect } from 'react';
import { CheckboxIcon } from '../../../shared/components/CustomIcons';
import { context } from '@devvit/web/client';
import { getSubredditUserFlairs } from '../../api/dashboardApi';
import { SubredditUserFlairsResult } from '../../../../shared/types/dashboardApi';

type HeaderTabs = 'title' | 'settings';

export interface SurveyConfigEditorProps {
    survey: SurveyDto;
    allowDev: boolean;
    onInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>)  => void;
    onInputBlur: (e: FocusEvent<HTMLInputElement> | FocusEvent<HTMLTextAreaElement>)  => void;
    setSurvey: Dispatch<SetStateAction<SurveyDto>>;
}

export const SurveyHeaderEditor = (props: SurveyConfigEditorProps) => {
    const {survey, allowDev, onInputChange, onInputBlur, setSurvey} = props;
    const [headerTab, setHeaderTab] = useState<HeaderTabs>('title');
    const [userFlair, setUserFlair] = useState<SubredditUserFlairsResult | null>(null);

    useEffect(() => {
        const call = async () => {
            try {
                setUserFlair(await getSubredditUserFlairs());
            } catch (e) {
                console.error('[Survey Dash] Failed to fetch user flairs: ', e);
            }
        };
        void call();
    }, []);

    const criteria = survey.responderCriteria ?? DefaultResponderCriteria;
    const onChangeCriteria = (newCriteria: ResponderCriteriaDto) => {
        setSurvey(s => {
            return {
                ...s,
                responderCriteria: newCriteria
            };
        });
    };
    const onChangeNumber = (field: string, e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if ([...value.matchAll(/\D/g)].length > 0) {
            e.preventDefault();
            return;
        }
        const parsedValue = parseInt(value);
        setSurvey(s => {
            return {
                ...s,
                responderCriteria: {
                    ...criteria,
                    [field]: isNaN(parsedValue) ? null : parsedValue
                },
            };
        });
    };
    const preventNonNumeric = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key) && e.key.indexOf('Arrow') < 0 && e.key !== 'Home' && e.key !== 'End' && e.key != 'Tab' && e.key !== 'Backspace' && e.key !== 'Delete' && !e.metaKey && !e.ctrlKey)
            e.preventDefault();
    }

    const buttonActive = "border-b-2 border-blue-300 dark:border-blue-700 font-bold";
    const buttonInactive = "border-b-1 border-neutral-300 dark:border-neutral-700 cursor-pointer hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100";

    return (
        <div className="relative text-sm p-4 flex flex-col gap-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white dark:bg-neutral-900 border-1 border-neutral-300 dark:border-neutral-700">
            <div className="w-full pb-4 flex gap-4 justify-center align-center">
                <button className={`px-4 py-1 ${headerTab == 'title' ? buttonActive : buttonInactive}`} onClick={() => setHeaderTab('title')}>Survey Title</button>
                <button className={`px-4 py-1 ${headerTab == 'settings' ? buttonActive : buttonInactive}`} onClick={() => setHeaderTab('settings')}>Settings</button>
            </div>
            {
                (() => {
                    switch (headerTab) {

                        case 'settings': {
                            const optionStyle = "px-2 text-neutral-900 bg-neutral-50 dark:text-neutral-100 dark:bg-neutral-950";
                            return (
                                <div className="pb-6 px-8 flex flex-col gap-4">
                                    <div className="flex gap-4 justify-start items-center group cursor-pointer" onClick={() => onChangeCriteria({ ...criteria, verifiedEmail: !criteria.verifiedEmail })}>
                                        <button className="w-[10rem] flex justify-end items-center cursor-pointer">
                                            <CheckboxIcon fill={criteria.verifiedEmail} />
                                        </button>
                                        <div><strong>Verified Email</strong> - Only users who have a verified email on their account can respond.</div>
                                    </div>
                                    <div className="flex gap-4 justify-start items-center group cursor-pointer" onClick={() => onChangeCriteria({ ...criteria, approvedUsers: !criteria.approvedUsers })}>
                                        <button className="w-[10rem] flex justify-end items-center cursor-pointer">
                                            <CheckboxIcon fill={criteria.approvedUsers} />
                                        </button>
                                        <div><strong>Approved Users</strong> - Only subreddit approved users can respond.</div>
                                    </div>
                                    <div className="flex gap-4 justify-start items-center">
                                        <input
                                            value={criteria.minAge ?? ''}
                                            placeholder="none"
                                            onKeyDown={preventNonNumeric}
                                            onChange={(e) => onChangeNumber('minAge', e)}
                                            className="w-[10rem] px-2 py-1 text-sm text-right border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                        />
                                        <div><strong>Minimum Account Age (Days)</strong> - A user's account must be this many days old to respond.</div>
                                    </div>
                                    <div className="flex gap-4 justify-start items-center">
                                        <div className="w-[10rem] gap-2 flex flex-col justify-end items-center">
                                            <select className="w-full px-2 py-1 text-right text-sm border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white">
                                                <option className={optionStyle}>None</option>
                                                <option className={optionStyle}>Post + Comment</option>
                                                <option className={optionStyle}>Post</option>
                                                <option className={optionStyle}>Comment</option>
                                            </select>
                                            <input
                                                value={criteria.minKarma?.value ?? ''}
                                                placeholder="none"
                                                onKeyDown={preventNonNumeric}
                                                onChange={(e) => onChangeNumber('minAge', e)}
                                                className="w-[10rem] px-2 py-1 text-sm text-right border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                            />
                                        </div>
                                        <div><strong>Minimum Account Karma</strong> - A user's account must have this minimum karma to respond.</div>
                                    </div>
                                    <div className="flex gap-4 justify-start items-center">
                                        <div className="w-[10rem] gap-2 flex flex-col justify-end items-center">
                                            <select className="w-full px-2 py-1 text-right text-sm border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white">
                                                <option className={optionStyle}>None</option>
                                                <option className={optionStyle}>Post + Comment</option>
                                                <option className={optionStyle}>Post</option>
                                                <option className={optionStyle}>Comment</option>
                                            </select>
                                            <input
                                                value={criteria.minSubKarma?.value ?? ''}
                                                placeholder="none"
                                                onKeyDown={preventNonNumeric}
                                                onChange={(e) => onChangeNumber('minAge', e)}
                                                className="w-[10rem] px-2 py-1 text-sm text-right border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                            />
                                        </div>
                                        <div><strong>Minimum Community Karma</strong> - A user's account must have this minimum karma in r/{context?.subredditName ?? '{currentSubName}'} to respond.</div>
                                    </div>
                                    <div className="flex gap-4 .justify-start items-center">
                                        {userFlair?.flairs.map(f => <p key={f.id}>{f.text}</p>)}
                                    </div>
                                </div>
                            );
                        }

                        case 'title':
                            return (
                                <>
                                    <div>
                                        <input name="title" placeholder="Survey Title" maxLength={50} value={survey.title} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full text-2xl border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                                        <div className={`text-xs p-1 text-right bg-white dark:bg-neutral-900 ${50-survey.title.length <= 10 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{survey.title.length} / 50</div>
                                    </div>
                                    <div>
                                        <textarea name="intro" placeholder="Captivate your audiance with a survey prompt." maxLength={512} value={survey.intro} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full min-h-[4rem] max-h-[10rem] border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                                        <div className={`text-xs p-1 text-right bg-white dark:bg-neutral-900 ${512-survey.intro.length <= 50 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{survey.intro.length} / 512</div>
                                    </div>
                                </>
                            );
                    }
                })()
            }
            {allowDev && (<div className="text-[0.5rem] absolute bottom-4 left-4">{survey.id}</div>)}
        </div>
    );
};
