/*!
* Viewer for a given survey.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { useContext } from 'react';
import { KarmaType, ResultVisibility, SurveyDto } from '../../../../shared/redis/SurveyDto';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { DashboardContext } from '../../DashboardContext';
import { MultiOptionViewer } from './questionTypes/MultiOptionViewer';
import { ScaleViewer } from './questionTypes/ScaleViewer';

export interface SurveyViewerProps {
    survey: SurveyDto | null;
}

export const SurveyViewer = (props: SurveyViewerProps) => {

    // Confirm context exists
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    // Helper to check if IDs should be displayed or not
    const allowDev = ctx.userInfo?.allowDev ?? false;

    // Confirm survey questions are defined
    const survey = props.survey;
    if (!survey?.questions) throw Error('Survey provided is missing question list. This is unexpected.');

    // Generate the responder criteria values that apply to this survey
    const criteria = survey.responderCriteria;
    const criteriaItems: string[] = [];
    if (criteria) {
        if (criteria.verifiedEmail)
            criteriaItems.push('Verified Email');
        if (criteria.approvedUsers)
            criteriaItems.push('Approved Users');
        if (criteria.minAge && criteria.minAge > 0)
            criteriaItems.push(`Account Age over ${criteria.minAge} days old`);
        if (criteria.minKarma && criteria.minKarma.value > 0) {
            const kType = criteria.minKarma.type;
            const typeS = kType == KarmaType.Comment
                ? 'Comment'
                : kType == KarmaType.Post ? 'Post' : 'Total';
            criteriaItems.push(`Account ${typeS} Karma over ${criteria.minKarma.value.toLocaleString()}`);
        }
        if (criteria.minSubKarma && criteria.minSubKarma.value > 0) {
            const kType = criteria.minSubKarma.type;
            const typeS = kType == KarmaType.Comment
                ? 'Comment'
                : kType == KarmaType.Post ? 'Post' : 'Total';
            criteriaItems.push(`Subreddit ${typeS} Karma over ${criteria.minSubKarma.value.toLocaleString()}`);
        }
        if (criteria.userFlairs && criteria.userFlairs.length > 0) {
            criteriaItems.push(criteria.userFlairs.map(f => `${f.type} => ${f.value}`).join(' '));
        }
    } else {
        criteriaItems.push('None');
    }

    return (
        <>
            <div className="flex justify-between items-center border-b">
                <h1 className="text-md lg:text-2xl font-bold my-4">Survey Viewer</h1>
                <div className="flex gap-4 my-4">
                    <button
                        className="border-2 bg-neutral-200 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 px-2 py-1 rounded-lg text-small hover:bg-neutral-300 hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:border-neutral-500 flex gap-2 items-center cursor-pointer"
                        onClick={() => ctx.setPageContext({ page: 'list' })}
                    >
                        <XMarkIcon className="size-6" />
                        <div>Close</div>
                    </button>
                </div>
            </div>
            <div className="my-4">
                <div className="flex flex-col gap-8">
                    <div className="relative text-sm p-4 flex flex-col gap-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white dark:bg-neutral-900 border-1 border-neutral-300 dark:border-neutral-700">
                        <h2 className="text-xl font-bold">{survey.title}</h2>
                        {survey.intro && (
                            <p>{survey.intro}</p>
                        )}
                        <h3 className="border-b-1">Responder Criteria</h3>
                        <ul className="list-disc pl-5">
                            {criteriaItems.map(i => <li>{i}</li>)}
                        </ul>
                        <h3 className="border-b-1">Survey Settings</h3>
                        <p>
                            <span className="underline">Result Visibility:</span>&nbsp;
                            {(() => {
                                switch (survey.resultVisibility) {
                                    case ResultVisibility.Always: return 'Always';
                                    case ResultVisibility.Closed: return 'Once Closed';
                                    case ResultVisibility.Responders: return 'Responders + Mods';
                                    case ResultVisibility.Mods: return 'Mods Only';
                                    default: return 'Always';
                                }
                            })()}
                        </p>
                        {allowDev && (<div className="text-[0.5rem] absolute bottom-1 right-4">{survey.id}</div>)}
                    </div>
                    {survey.questions.map(q => (
                        <div key={`qe_${q.id}`} className="relative text-sm p-4 flex flex-col gap-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white dark:bg-neutral-900 border-1 border-neutral-300 dark:border-neutral-700">
                            <h3 className="text-lg font-bold">{q.title}</h3>
                            {q.description && (
                                <p>{q.description}</p>
                            )}
                            {(() => {
                                switch (q.type) {
                                    case 'multi':
                                    case 'checkbox':
                                    case 'rank':
                                        return <MultiOptionViewer question={q} />;
                                    case 'scale':
                                        return <ScaleViewer question={q} />;
                                    case 'text':
                                    default:
                                        return (<p>Unknown question type {q.type}</p>)
                                }
                            })()}
                            {allowDev && (<div className="text-[0.5rem] absolute bottom-1 right-4">{q.id}</div>)}
                        </div>
                    ))}
                    <div className="relative text-sm p-4 flex flex-col gap-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white dark:bg-neutral-900 border-1 border-neutral-300 dark:border-neutral-700">
                        <p>{survey.outro}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center border-t mt-8">
                <div className="flex gap-4 my-4">
                    <button
                        className="border-2 bg-neutral-200 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 px-2 py-1 rounded-lg text-small hover:bg-neutral-300 hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:border-neutral-500 flex gap-2 items-center cursor-pointer"
                        onClick={() => ctx.setPageContext({ page: 'list' })}
                    >
                        <XMarkIcon className="size-6" />
                        <div>Close</div>
                    </button>
                </div>
            </div>
        </>
    );
};
