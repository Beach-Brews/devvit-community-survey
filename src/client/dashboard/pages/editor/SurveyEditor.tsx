/*!
* Editor for a given survey.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import { SurveyDto, SurveyQuestionDto } from '../../../../shared/redis/SurveyDto';
import { CalendarDaysIcon, DocumentCheckIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import { SurveyQuestionEditor } from './questionTypes/SurveyQuestionEditor';
import { Constants } from '../../../../shared/constants';
import { genQuestion, genSurvey } from '../../../../shared/redis/uuidGenerator';
import { DashboardContext } from '../../DashboardContext';

export interface SurveyEditorProps {
    survey: SurveyDto | null;
}

export const SurveyEditor = (props: SurveyEditorProps) => {

    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const [survey, setSurvey] = useState<SurveyDto>(props.survey ?? genSurvey());

    const saveSurvey = useCallback((s: SurveyDto, close: boolean) => {
        // TODO: Call API to save first
        console.log("Save survey! ", s, JSON.stringify(s).length);
        if (close)
            ctx.setPageContext({page: 'list'});
    }, [ctx]);

    useEffect(() => {
        // TODO: How to prevent this from calling on initial render? useRef doesn't seem to work...
        const timeout = setTimeout(async () => {
            saveSurvey(survey, false);
        }, Constants.SURVEY_AUTOSAVE_DEBOUNCE);
        return () => {
            clearTimeout(timeout);
        }
    }, [survey, saveSurvey]);

    const modifySurveyQuestion = useCallback((question: SurveyQuestionDto, action?: 'up' | 'down' | 'delete') => {
        setSurvey(s => {
            const ql = s.questions;
            const idx = ql.findIndex(q => q.id == question.id);
            if (idx >= 0) {
                switch (action) {
                    case 'up':
                    case 'down': {
                        const newState = [...ql];
                        if (idx > 0 && action == 'up') {
                            const qBefore = ql[idx-1];
                            const thisQ = ql[idx];
                            if (thisQ && qBefore) {
                                thisQ.order -= 1;
                                qBefore.order += 1;
                                newState[idx - 1] = thisQ;
                                newState[idx] = qBefore;
                            }
                        }
                        if (idx < ql.length - 1 && action == 'down') {
                            const qAFter = ql[idx+1];
                            const thisQ = ql[idx];
                            if (thisQ && qAFter) {
                                thisQ.order += 1;
                                qAFter.order -= 1;
                                newState[idx + 1] = thisQ;
                                newState[idx] = qAFter;
                            }
                        }
                        return { ...s, questions: newState};
                    }

                    case 'delete': {
                        const newState: SurveyQuestionDto[] = [];
                        for (let i = 0; i < ql.length; ++i) {
                            const q = ql[i];
                            if (!q || i == idx) continue;

                            if (i > idx) {
                                q.order = i+1;
                            }
                            newState.push(q);
                        }
                        // Force at least one question
                        if (newState.length <= 0)
                            newState.push(genQuestion(0));
                        return { ...s, questions: newState};
                    }

                    default: {
                        const newState = [...ql];
                        newState[idx] = question;
                        return { ...s, questions: newState};
                    }
                }
            } else {
                console.error(`Failed to find question ${question.id}`);
            }
            return s;
        });
    }, [setSurvey]);

    const onInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        setSurvey(s => {
            return {
                ...s,
                [e.target.name]: e.target.value
            };
        });
    };

    const onInputBlur = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const fieldName = e.target.name;
        let value = e.target.value;

        //  Force a value for the title
        if (fieldName === 'title' && (!value || value.length <= 0)) {
            value = 'Untitled Survey';
        }

        // Force a default value for the outro (end screen)
        if (fieldName === 'outro' && (!value || value.length <= 0)) {
            value = 'Thank you for your response.';
        }

        // Do not update state if value is the same
        if ((survey as never)[fieldName] === value) {
            return;
        }

        setSurvey(s => {
            return {
                ...s,
                [fieldName]: value
            };
        });
    };

    const onAddQuestion = () => {
        setSurvey(s => {
            return {
                ...s,
                questions: [
                    ...s.questions,
                    genQuestion(s.questions.length)
                ]
            };
        });
    };

    const requestPublish = async () => {
        // TODO: Show modal
    };

    return (
        <>
            <div className="flex justify-between items-center border-b">
                <h1 className="text-md lg:text-2xl font-bold my-4">Survey Editor</h1>
                <div className="flex gap-4 my-4">
                    <button
                        className="border-2 border-blue-800 bg-blue-800 text-white px-2 py-1 rounded-lg text-small hover:bg-blue-700 hover:border-blue-300 dark:hover:border-blue-600 flex gap-2 items-center cursor-pointer"
                        onClick={requestPublish}
                    >
                        <CalendarDaysIcon className="size-6" />
                        <div>Publish</div>
                    </button>
                    <button
                        className="border-2 bg-neutral-200 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 px-2 py-1 rounded-lg text-small hover:bg-neutral-300 hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:border-neutral-500 flex gap-2 items-center cursor-pointer"
                        onClick={() => saveSurvey(survey, true)}
                    >
                        <DocumentCheckIcon className="size-6" />
                        <div>Save</div>
                    </button>
                </div>
            </div>
            <div className="my-4">
                <div className="flex flex-col gap-8">
                    <div className="text-sm p-4 flex flex-col gap-2 text-neutral-700 dark:text-neutral-300 rounded-md bg-white shadow-md dark:bg-neutral-900 dark:shadow-neutral-800">
                        <div>
                            <input name="title" placeholder="Survey Title" maxLength={50} value={survey.title} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full text-2xl border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                            <div className={`text-xs p-1 text-right bg-white dark:bg-neutral-900 ${50-survey.title.length <= 10 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{survey.title.length} / 50</div>
                        </div>
                        <div>
                            <textarea name="intro" placeholder="Captivate your audiance with a survey prompt." maxLength={512} value={survey.intro} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full min-h-[4rem] max-h-[10rem] border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                            <div className={`text-xs p-1 text-right bg-white dark:bg-neutral-900 ${512-survey.intro.length <= 50 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{survey.intro.length} / 512</div>
                        </div>
                    </div>
                    {survey.questions.map((q,i) => <SurveyQuestionEditor key={`qe_${q.id}`} question={q} modifyQuestion={modifySurveyQuestion} isFirst={i==0} isLast={i==survey.questions.length-1} />)}
                    <div className="flex justify-center">
                        <button disabled={survey.questions.length == Constants.MAX_QUESTION_COUNT} onClick={onAddQuestion} className="w-1/2 lg:w-1/3 border-2 border-lime-800 bg-lime-800 text-white px-2 py-1 rounded-lg text-small hover:bg-lime-700 hover:border-lime-600 flex justify-center gap-2 items-center cursor-pointer disabled:pointer-events-none disabled:opacity-50">
                            {survey.questions.length == Constants.MAX_QUESTION_COUNT
                                ? <div>Max Question Count Reached</div>
                                : <><PlusCircleIcon className="size-5" /><div>Add Question</div></>
                            }
                        </button>
                    </div>
                    <div className="text-sm p-4 flex flex-col gap-4 text-neutral-700 dark:text-neutral-300 rounded-md bg-white shadow-md dark:bg-neutral-900 dark:shadow-neutral-800">
                        <div >
                            <textarea name="outro" placeholder="Thank the responders with an outro." maxLength={512} value={survey.outro} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full min-h-[4rem] max-h-[10rem] border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                            <div className={`text-xs p-1 text-right bg-neutral-50 dark:bg-neutral-900 ${512-survey.outro.length <= 50 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{survey.outro.length} / 512</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
