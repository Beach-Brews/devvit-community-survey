/*!
* Editor for survey title, intro, and other settings.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import {
    DefaultResponderCriteria,
    FlairType,
    KarmaType,
    KarmaTypeType,
    ResponderCriteriaDto,
    ResultVisibility,
    ResultVisibilityType,
    SurveyDto,
} from '../../../../shared/redis/SurveyDto';
import { ChangeEvent, Dispatch, FocusEvent, KeyboardEvent, SetStateAction, useEffect, useState } from 'react';
import { CheckboxIcon } from '../../../shared/components/CustomIcons';
import { context } from '@devvit/web/client';
import { getSubredditUserFlairs } from '../../api/dashboardApi';
import { SubredditUserFlairsResult } from '../../../../shared/types/dashboardApi';

type HeaderTabs = 'title' | 'criteria' | 'settings';

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

    // TODO: Fix allowing negative values...
    const parseIntSafe = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === '-') return -0;
        if (value !== '' && !/^-?\d*$/.test(value)) {
            e.preventDefault();
            return undefined;
        }
        return parseInt(value);
    }
    const preventNonNumeric = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!/[0-9]/.test(e.key) &&
            e.key !== '-' &&
            e.key.indexOf('Arrow') < 0 &&
            e.key !== 'Home' &&
            e.key !== 'End' &&
            e.key !== 'Tab' &&
            e.key !== 'Backspace' &&
            e.key !== 'Delete' &&
            !e.metaKey &&
            !e.ctrlKey) {
            e.preventDefault();
        }
    };

    const onChangeNumber = (field: string, e: ChangeEvent<HTMLInputElement>) => {
        const parsedValue = parseIntSafe(e);
        if (parsedValue === undefined) return;
        setSurvey(s => {
            return {
                ...s,
                responderCriteria: {
                    ...criteria,
                    [field]: isNaN(parsedValue) ? null : parsedValue
                }
            };
        });
    };
    const onChangeKarma = (field: string, type: KarmaTypeType | undefined, value: number | undefined) => {
        if (value === undefined) return;
        setSurvey(s => {
            return {
                ...s,
                responderCriteria: {
                    ...criteria,
                    [field]: type !== undefined ? { type, value: isNaN(value) ? 0 : value } : null
                }
            };
        });
    };

    const buttonActive = "border-b-2 border-blue-300 dark:border-blue-700 font-bold";
    const buttonInactive = "border-b-1 border-neutral-300 dark:border-neutral-700 cursor-pointer hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100";
    const optionStyle = "px-2 text-neutral-900 bg-neutral-50 dark:text-neutral-100 dark:bg-neutral-950";

    return (
        <div className="relative text-sm p-4 flex flex-col gap-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white dark:bg-neutral-900 border-1 border-neutral-300 dark:border-neutral-700">
            <div className="w-full pb-4 flex gap-4 justify-center align-center">
                <button className={`px-4 py-1 ${headerTab == 'title' ? buttonActive : buttonInactive}`} onClick={() => setHeaderTab('title')}>Survey Title</button>
                <button className={`px-4 py-1 ${headerTab == 'criteria' ? buttonActive : buttonInactive}`} onClick={() => setHeaderTab('criteria')}>Responder Criteria</button>
                <button className={`px-4 py-1 ${headerTab == 'settings' ? buttonActive : buttonInactive}`} onClick={() => setHeaderTab('settings')}>Survey Settings</button>
            </div>
            {
                (() => {
                    switch (headerTab) {

                        case 'criteria': {
                            return (
                                <div className="mb-6 px-4 grid grid-cols-[3fr_1fr_16fr] gap-4">
                                    {/* Verified Email */}
                                    <div
                                        className="contents group cursor-pointer"
                                        onClick={() =>
                                            onChangeCriteria({
                                                ...criteria,
                                                verifiedEmail: !criteria.verifiedEmail,
                                            })
                                        }
                                    >
                                        <div className="flex justify-end items-center">
                                            <button className="cursor-pointer">
                                                <CheckboxIcon fill={criteria.verifiedEmail} />
                                            </button>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <strong>Verified Email</strong> - Only users who have a verified email on their account can respond.
                                        </div>
                                    </div>

                                    {/* Approved Users */}
                                    <div
                                        className="contents group cursor-pointer"
                                        onClick={() =>
                                            onChangeCriteria({
                                                ...criteria,
                                                approvedUsers: !criteria.approvedUsers,
                                            })
                                        }
                                    >
                                        <div className="flex justify-end items-center">
                                            <button className="cursor-pointer">
                                                <CheckboxIcon fill={criteria.approvedUsers} />
                                            </button>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <strong>Approved Users</strong> - Only subreddit approved users can respond.
                                        </div>
                                    </div>

                                    {/* Min Age (Days) */}
                                    <div className="col-span-3 flex flex-col-reverse gap-2 md:contents">
                                        <div className="flex justify-start items-center md:justify-end">
                                            <input
                                                value={criteria.minAge ?? ''}
                                                placeholder="none"
                                                onKeyDown={preventNonNumeric}
                                                onChange={(e) => onChangeNumber('minAge', e)}
                                                className="w-full md:w-[5rem] px-2 py-1 text-sm md:text-right border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                            />
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <strong>Minimum Account Age (Days)</strong> - A user's account must be this many days old to respond.
                                        </div>
                                    </div>

                                    {/* Min Account Karma */}
                                    <div className="col-span-3 flex flex-col-reverse gap-2 md:contents">
                                        <div className="flex justify-start items-center md:justify-end">
                                            <select
                                                value={criteria.minKarma?.type}
                                                onChange={(e) =>
                                                    onChangeKarma(
                                                        'minKarma',
                                                        e.target.value === '' ? undefined : e.target.value as KarmaTypeType,
                                                        criteria.minKarma?.value ?? 0
                                                    )
                                                }
                                                className="w-full px-2 py-1 md:text-right text-sm border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                            >
                                                <option value={''} className={optionStyle}>None</option>
                                                <option value={KarmaType.Both} className={optionStyle}>Post + Comment</option>
                                                <option value={KarmaType.Post} className={optionStyle}>Post</option>
                                                <option value={KarmaType.Comment} className={optionStyle}>Comment</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <strong>Minimum Account Karma</strong> - A user's account must have a minimum Post, Comment, or total karma to respond.
                                        </div>
                                    </div>

                                    {/* Min Karma Value */}
                                    {criteria.minKarma?.type !== undefined && (
                                        <div className="col-span-3 pl-8 md:pl-0 flex flex-col-reverse gap-2 md:contents">
                                            <div className="flex justify-start items-center md:justify-end col-span-2">
                                                <input
                                                    value={criteria.minKarma.value ?? 0}
                                                    placeholder="none"
                                                    onKeyDown={preventNonNumeric}
                                                    onChange={(e) =>
                                                        onChangeKarma(
                                                            'minKarma',
                                                            criteria.minKarma?.type,
                                                            parseIntSafe(e)
                                                        )
                                                    }
                                                    className="w-full md:w-[5rem] px-2 py-1 text-sm md:text-right border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <strong>Minimum Account Karma Value</strong> - The minimum karma amount, based on the selector above.
                                            </div>
                                        </div>
                                    )}

                                    {/* Min Sub Account Karma */}
                                    <div className="col-span-3 flex flex-col-reverse gap-2 md:contents">
                                        <div className="flex justify-start items-center md:justify-end">
                                            <select
                                                value={criteria.minSubKarma?.type}
                                                onChange={(e) =>
                                                    onChangeKarma(
                                                        'minSubKarma',
                                                        e.target.value === '' ? undefined : e.target.value as KarmaTypeType,
                                                        criteria.minSubKarma?.value ?? 0
                                                    )
                                                }
                                                className="w-full px-2 py-1 md:text-right text-sm border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                            >
                                                <option value={undefined} className={optionStyle}>None</option>
                                                <option value={KarmaType.Both} className={optionStyle}>Post + Comment</option>
                                                <option value={KarmaType.Post} className={optionStyle}>Post</option>
                                                <option value={KarmaType.Comment} className={optionStyle}>Comment</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <strong>Minimum Community Karma</strong> - A user's account must have this minimum karma in r/{context?.subredditName ?? '{currentSubName}'}{' '}to respond.
                                        </div>
                                    </div>

                                    {/* Min Sub  Karma Value */}
                                    {criteria.minSubKarma?.type !== undefined && (
                                        <div className="col-span-3 pl-8 md:pl-0 flex flex-col-reverse gap-2 md:contents">
                                            <div className="flex justify-start items-center md:justify-end col-span-2">
                                                <input
                                                    value={criteria.minSubKarma.value ?? 0}
                                                    type="number"
                                                    onChange={(e) =>
                                                        onChangeKarma(
                                                            'minSubKarma',
                                                            criteria.minSubKarma?.type,
                                                            parseIntSafe(e)
                                                        )
                                                    }
                                                    className="w-full md:w-[5rem] px-2 py-1 text-sm md:text-right border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <strong>Minimum Community Karma Value</strong> - The minimum karma amount, based on the selector above.
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-span-3 border-t-1"></div>

                                    <div>{/*Spacer*/}</div>
                                    <div className="col-span-2 flex items-center">
                                        <strong>User Flair</strong> - Only users with the selected flair(s) may respond
                                    </div>

                                    {/*criteria.userFlairs && criteria.userFlairs.length > 0 && criteria.userFlairs.map((c, i) => {
                                        return (
                                            <div key={`flaircri_${i}`} className="contents">
                                                <div className="flex justify-start items-center md:justify-end">
                                                    <select
                                                        value={c.type}
                                                        className="w-full px-2 py-1 md:text-right text-sm border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                                    >
                                                        <option value={FlairType.TEXT_EQUAL} className={optionStyle}>Text (Equal)</option>
                                                        <option value={FlairType.TEXT_PARTIAL} className={optionStyle}>Text (RegEx)</option>
                                                        <option value={FlairType.CSS_CLASS} className={optionStyle}>CSS Class</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        value={''}
                                                        onChange={(e) => onChangeNumber('minAge', e)}
                                                        className="w-full md:w-[5rem] px-2 py-1 text-sm md:text-right border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })*/}

                                    {userFlair?.flairs && userFlair?.flairs.length > 0 ? (
                                        userFlair.flairs.map((f) => {
                                            const isSelected = criteria.userFlairs !== null && criteria.userFlairs.length > 0 && criteria.userFlairs.some(c => c.value === f.text);
                                            return (
                                                <div
                                                    key={`flair_${f.id}`}
                                                    className="contents group cursor-pointer"
                                                    onClick={() => {
                                                        const flairCriteria = criteria.userFlairs ?? [];
                                                        onChangeCriteria({
                                                            ...criteria,
                                                            userFlairs: isSelected
                                                                ? [...flairCriteria.filter(s => s.value !== f.text)]
                                                                : [...flairCriteria, { type: FlairType.TextEqual, value: f.text }],
                                                        });
                                                    }}
                                                >
                                                    <div className="flex justify-end items-center">
                                                        <button className="cursor-pointer">
                                                            <CheckboxIcon fill={isSelected} />
                                                        </button>
                                                    </div>
                                                    <div className="col-span-2 flex items-center">
                                                        {f.text}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-3">No user flairs configured.</div>
                                    )}
                                </div>
                            );
                        }

                        case "settings": {
                            return (
                                <div className="mb-6 px-4 grid grid-cols-[3fr_1fr_16fr] gap-4">

                                    {/* Result Visibility */}
                                    <div className="col-span-3 flex flex-col-reverse gap-2 md:contents">
                                        <div className="flex justify-start items-center md:justify-end">
                                            <select
                                                value={survey.resultVisibility ?? ResultVisibility.Always}
                                                className="w-full px-2 py-1 md:text-right text-sm border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white"
                                                onChange={(e) =>
                                                    setSurvey(s => {
                                                        return {
                                                            ...s,
                                                            resultVisibility: e.target.value as ResultVisibilityType
                                                        };
                                                    })
                                                }
                                            >
                                                <option value={ResultVisibility.Always} className={optionStyle}>Always</option>
                                                <option value={ResultVisibility.Closed} className={optionStyle}>Closed Only</option>
                                                <option value={ResultVisibility.Mods} className={optionStyle}>Mods Only</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2 flex items-center">
                                            <strong>Result Visibility</strong> - Choose whether results are always visible, only when survey has closed, or only mods can see results.
                                        </div>
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
