/*!
* Editor for a given survey.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ChangeEvent, useCallback, useState } from 'react';
import { SurveyDto, SurveyQuestionDto, SurveyQuestionList } from '../../../../shared/redis/SurveyDto';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { SurveyQuestionEditor } from './questionTypes/SurveyQuestionEditor';
import { Constants } from '../../../../shared/constants';
import { genQuestion } from '../../../../shared/redis/uuidGenerator';

export interface SurveyEditorProps {
    survey: SurveyDto | null;
}

interface SurveyEditorForm {
    title: string;
    intro: string;
    outro: string;
}

export const SurveyEditor = (props: SurveyEditorProps) => {
    const { survey } = props;

    const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestionList>(survey?.questions
        ?? [ genQuestion(0) ]);

    const [formFields, setFormFields] = useState<SurveyEditorForm>({
        title: survey?.title ?? 'Untitled Survey',
        intro: survey?.intro ?? '',
        outro: survey?.outro ?? 'Thank you for your response.',
    });

    const modifySurveyQuestion = useCallback((question: SurveyQuestionDto, action?: 'up' | 'down' | 'delete') => {
        setSurveyQuestions(s => {
            const idx = s.findIndex(q => q.id == question.id);
            if (idx >= 0) {
                switch (action) {
                    case 'up':
                    case 'down': {
                        const newState = [...s];
                        if (idx > 0 && action == 'up') {
                            const qBefore = s[idx-1];
                            const thisQ = s[idx];
                            if (thisQ && qBefore) {
                                thisQ.order -= 1;
                                qBefore.order += 1;
                                newState[idx - 1] = thisQ;
                                newState[idx] = qBefore;
                            }
                        }
                        if (idx < s.length - 1 && action == 'down') {
                            const qAFter = s[idx+1];
                            const thisQ = s[idx];
                            if (thisQ && qAFter) {
                                thisQ.order += 1;
                                qAFter.order -= 1;
                                newState[idx + 1] = thisQ;
                                newState[idx] = qAFter;
                            }
                        }
                        return newState;
                    }

                    case 'delete': {
                        const newState: SurveyQuestionDto[] = [];
                        for (let i = 0; i < s.length; ++i) {
                            const q = s[i];
                            if (!q || i == idx) continue;

                            if (i > idx) {
                                q.order = i+1;
                            }
                            newState.push(q);
                        }
                        // Force at least one question
                        if (newState.length <= 0)
                            newState.push(genQuestion(0));
                        return newState;
                    }

                    default: {
                        const newState = [...s];
                        newState[idx] = question;
                        return newState;
                    }
                }
            } else {
                console.error(`Failed to find question ${question.id}`);
                return s;
            }
        });
    }, [setSurveyQuestions]);

    const onInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setFormFields(s => {
            return {
                ...s,
                [e.target.name]: e.target.value
            };
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
            };
        });
    };

    const onAddQuestion = () => {
        setSurveyQuestions(q => {
            return [
                ...q,
                genQuestion(q.length)
            ];
        });
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
                    <div className={`text-xs p-1 text-right bg-white dark:bg-neutral-900 ${512-formFields.intro.length <= 50 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{formFields.intro.length} / 512</div>
                </div>
            </div>
            {surveyQuestions.map((q,i) => <SurveyQuestionEditor key={`qe_${q.id}`} question={q} modifyQuestion={modifySurveyQuestion} isFirst={i==0} isLast={i==surveyQuestions.length-1} />)}
            <div className="flex justify-center">
                <button disabled={surveyQuestions.length == Constants.MAX_QUESTION_COUNT} onClick={onAddQuestion} className="w-1/2 lg:w-1/3 border-2 border-lime-800 bg-lime-800 text-white px-2 py-1 rounded-lg text-small hover:bg-lime-700 hover:border-lime-600 flex justify-center gap-2 items-center cursor-pointer disabled:pointer-events-none disabled:opacity-50">
                    {surveyQuestions.length == Constants.MAX_QUESTION_COUNT
                        ? <div>Max Question Count Reached</div>
                        : <><PlusCircleIcon className="size-5" /><div>Add Question</div></>
                    }
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
