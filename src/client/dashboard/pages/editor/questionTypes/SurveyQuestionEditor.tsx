/*!
* Editor container for the various question types.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { MultiOptionEditor } from './MultiOptionEditor';
import { ScaleEditor } from './ScaleEditor';
import { CommonQuestionEditorProps } from './commonEditorTypes';
import React, { ChangeEvent, useContext } from 'react';
import { QuestionType } from '../../../../../shared/redis/SurveyDto';
import { ArrowDownCircleIcon, ArrowUpCircleIcon, DocumentDuplicateIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DashboardContext } from '../../../DashboardContext';
import { DashboardModal } from '../../../shared/components/DashboardModal';
import { genOption } from '../../../../../shared/redis/uuidGenerator';

export const SurveyQuestionEditor = (props: CommonQuestionEditorProps) => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const q = props.question;

    const onChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newQ = {...q};
        newQ.type = e.target.value as QuestionType;
        switch (newQ.type) {
            case 'multi':
            case 'checkbox':
            case 'rank':
                newQ.options = newQ.options ?? [ genOption(0) ];
                break;
            case 'scale':
                newQ.min = newQ.min ?? 1;
                newQ.max = newQ.max ?? 5;
                newQ.minLabel = newQ.minLabel ?? '';
                newQ.midLabel = newQ.midLabel ?? '';
                newQ.maxLabel = newQ.maxLabel ?? '';
                break;
            case 'text':
                newQ.min = newQ.min ?? 0;
                newQ.max = newQ.max ?? 150;
                break;
        }
        props.modifyQuestion(newQ);
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const fieldName = e.target.name;
        const value = e.target.value;
        props.modifyQuestion({
            ...q,
            [fieldName]: value
        });
    };

    const onInputBlur = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const fieldName = e.target.name;
        let value = e.target.value;

        // Force a question title
        if (fieldName === 'title' && (!value || value.length <= 0)) {
            value = 'Question Title';
        }

        if ((q as never)[fieldName] === value) {
            console.log('Not updated');
            return;
        }

        props.modifyQuestion({
            ...q,
            [fieldName]: value
        });
    };

    const onMoveUp = () => {
        props.modifyQuestion(props.question, 'up');
    };

    const onMoveDown = () => {
        props.modifyQuestion(props.question, 'down');
    };
    const onDeleteQuestion = () => {
        const onDeleteCallback = async () => {
            props.modifyQuestion(props.question, 'delete');
            return true;
        };

        ctx.setModal(<DashboardModal title="Confirm Delete" type="destroy" onAccept={onDeleteCallback}>
            <div className="text-lg flex flex-col gap-2">
                <div>Are you should you want to delete this survey question?</div>
                <div className="p-2 bg-neutral-200 dark:bg-neutral-800">
                    {props.question.title}
                </div>
                <div className="font-bold text-red-600 dark:text-red-400">
                    This action cannot be undone!
                </div>
            </div>
        </DashboardModal>)
    };

    const renderQuestionEditor = () => {
        switch (q.type) {
            case 'multi':
            case 'checkbox':
            case 'rank':
                return <MultiOptionEditor {...props} />;
            case 'scale':
                return <ScaleEditor {...props} />;
            case 'text':
            default:
                return <div>Question type {q.type} not currently supported.</div>;
        }
    };

    const onDuplicateQuestion = () => {
        props.duplicateAction?.(q);
    };

    return (
        <div className="relative flex p-4 pr-0 text-neutral-700 dark:text-neutral-300 rounded-md bg-white dark:bg-neutral-900 border-1 border-neutral-300 dark:border-neutral-700">
            {ctx.userInfo.allowDev && (<div className="text-[0.5rem] absolute bottom-2 right-2">{q.id}</div>)}
            <div className="w-full text-sm flex flex-col gap-4">
                <div>
                    <input name="title" placeholder="Question Title" maxLength={50} value={q.title} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                    <div className={`text-xs p-1 text-right bg-white dark:bg-neutral-900 ${50-q.title.length <= 10 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{q.title.length} / 50</div>
                </div>
                <div>
                    <textarea name="description" placeholder="(optional) Provide more detail about this question." maxLength={512} value={q.description} onChange={onInputChange} onBlur={onInputBlur} className="p-2 w-full min-h-[4rem] max-h-[10rem] border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                    <div className={`text-xs p-1 text-right bg-white dark:bg-neutral-900 ${512-q.description.length <= 50 ? 'font-bold text-red-800 dark:text-red-400' : ''}`}>{q.description.length} / 512</div>
                </div>
                <div className="flex gap-2 items-center">
                    <label>Question Type:</label>
                    <select value={q.type} onChange={onChangeType} className="border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white px-2 py-1 [&_option]:dark:bg-neutral-900 [&_option]:dark:text-neutral-300">
                        <option value="multi">Multiple Choice</option>
                        <option value="checkbox">Checkbox</option>
                        <option value="rank">Rank</option>
                        <option value="scale">Scale</option>
                        <option value="text">Text</option>
                    </select>
                </div>
                {renderQuestionEditor()}
            </div>
            <div className="w-12 flex flex-col items-center gap-4">
                <button disabled={props.isFirst} onClick={onMoveUp} className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200 disabled:pointer-events-none disabled:opacity-50"><ArrowUpCircleIcon className="size-6" /></button>
                <button disabled={props.isLast} onClick={onMoveDown} className="p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200 disabled:pointer-events-none disabled:opacity-50"><ArrowDownCircleIcon className="size-6" /></button>
                <button disabled={!props.duplicateAction} onClick={onDuplicateQuestion} className="mt-4 p-0.5 rounded-lg cursor-pointer hover:bg-blue-200 hover:text-blue-700 hover:dark:bg-blue-700 hover:dark:text-blue-200 disabled:pointer-events-none disabled:opacity-50"><DocumentDuplicateIcon className="size-6" /></button>
                <button onClick={onDeleteQuestion} className="mt-4 p-0.5 rounded-lg cursor-pointer hover:bg-rose-200 hover:text-rose-700 hover:dark:bg-rose-700 hover:dark:text-rose-200"><TrashIcon className="size-6" /></button>
            </div>
        </div>
    )
};
