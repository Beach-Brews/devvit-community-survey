/*!
* Editor for a given survey.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ChangeEvent, useContext, useState } from 'react';
import { DashboardContext } from '../../DashboardContext';
import { SurveyDto } from '../../../../shared/redis/SurveyDto';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

export interface SurveyEditorProps {
    survey: SurveyDto | null;
}

export interface SurveyEditorForm {
    title: string;
    intro: string;
    outro: string;
}

export const SurveyEditor = (props: SurveyEditorProps) => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const { survey } = props;

    const [formFields, setFormFields] = useState<SurveyEditorForm>({
        title: survey?.title ?? 'Untitled Survey',
        intro: survey?.intro ?? '',

        outro: survey?.outro ?? 'Thank you for your response.'
    });

    const onInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setFormFields(s => {
            return {
                ...s,
                [e.target.name]: e.target.value
            }
        });
    };

    const onInputBlur = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const fieldName = e.target.name;
        let value = e.target.value;

        if (fieldName === 'title' && (!value || value.length <= 0)) {
            value = 'Untitled Survey';
        }

        if (fieldName === 'outro' && (!value || value.length <= 0)) {
            value = 'Thank you for your response.';
        }

        setFormFields(s => {
            return {
                ...s,
                [fieldName]: value
            }
        });

        // TODO: Save updates automatically?
        // TODO: Save "previous saved" state (so, if nothing changed, don't send update)
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="text-sm p-4 flex flex-col gap-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white shadow-md dark:bg-neutral-900 dark:shadow-neutral-800">
                <div>
                    <input name="title" placeholder="Survey Title" maxLength={50} value={formFields.title} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full text-2xl border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                    <div className={`text-xs p-1 text-right bg-white dark:bg-neutral-900 ${50-formFields.title.length <= 10 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{formFields.title.length} / 50</div>
                </div>
                <div>
                    <textarea name="intro" placeholder="Captivate your audiance with a survey prompt." maxLength={512} value={formFields.intro} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full min-h-[4rem] max-h-[10rem] border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                    <div className={`text-xs p-1 text-right bg-neutral-50 dark:bg-neutral-900 ${512-formFields.intro.length <= 50 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{formFields.intro.length} / 512</div>
                </div>
            </div>
            <div className="text-sm p-4 flex flex-col gap-4 text-neutral-700 dark:text-neutral-300 rounded-md bg-white shadow-md dark:bg-neutral-900 dark:shadow-neutral-800">
                The first question
            </div>
            <div className="text-sm p-4 flex flex-col gap-4 text-neutral-700 dark:text-neutral-300 rounded-md bg-white shadow-md dark:bg-neutral-900 dark:shadow-neutral-800">
                The seceond question
            </div>
            <div className="flex justify-center">
                <button className="w-1/2 lg:w-1/3 border-2 border-lime-800 bg-lime-800 text-white px-2 py-1 rounded-lg text-small hover:bg-lime-700 hover:border-lime-600 flex justify-center gap-2 items-center cursor-pointer">
                    <PlusCircleIcon className="size-5" />
                    <div>Add Question</div>
                </button>
            </div>
            <div className="text-sm p-4 flex flex-col gap-4 text-neutral-700 dark:text-neutral-300 rounded-md bg-white shadow-md dark:bg-neutral-900 dark:shadow-neutral-800">
                <div >
                    <textarea name="outro" placeholder="Thank the responders with an outro." maxLength={512} value={formFields.outro} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full min-h-[4rem] max-h-[10rem] border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                    <div className={`text-xs p-1 text-right bg-neutral-50 dark:bg-neutral-900 ${512-formFields.outro.length <= 50 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{formFields.outro.length} / 512</div>
                </div>
            </div>
        </div>
    );
};
