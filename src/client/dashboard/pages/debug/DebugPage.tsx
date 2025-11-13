/*!
* Debug page which provides some dangerous actions.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ArrowLeftIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import { useState, useContext, ChangeEvent } from 'react';
import { DashboardContext } from '../../DashboardContext';

type KeyTypes = 'get' | undefined;

type KeyForm = {
    key: string;
    type: KeyTypes
}

type KeyDebugRequestDto = {
    key?: string | undefined;
    action?: 'get' | undefined;
    cursor?: number | undefined;
};

type KeyDebugHashValueDto = { [prop: string]: string };
type KeyDebugZMemberDto = {score: number, member: string};

type KeyDebugResponseDto = {
    type: 'string' | 'hash' | 'zset' | 'error';
    key?: string | undefined;
    data?: string | KeyDebugHashValueDto | KeyDebugZMemberDto[] | undefined;
    cursor?: number | undefined;
    error?: string | undefined;
};

const keys = [
    `usr:all`,
    `usr:$userId:svs`,
    `sv:$surveyId:conf`,
    `sv:$surveyId:qns`,
    `sv:pub`,
    `sv:$surveyId:usr`,
    `sv:$surveyId:qn:$questionId`,
    `usr:$userId:svr:$surveyId`
];

const variables = [...keys.reduce((r: Set<string>, k: string) => {
    [...k.matchAll(/\$(.*?)(:|$)/g)]
        .map(m => m && m[1])
        .filter(v => v !== undefined)
        .forEach(v => r.add(v));
    return r;
}, new Set<string>())];

export const DebugPage = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const [form, setForm] = useState<KeyForm>({ key: '', type: 'get' });
    const [varForm, setVarForm] = useState<{[key: string]: string}>({});
    const [results, setResults] = useState<KeyDebugResponseDto | undefined>(undefined);

    const onInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setForm(s => {
            return {
                ...s,
                [e.target.name]: e.target.value
            };
        });
    };

    const onVarChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setVarForm(s => {
            return {
                ...s,
                [e.target.name.substring(4)]: e.target.value
            };
        });
    };

    const onKeySelect = (key: string) => {
        setForm(s => {
            return { ...s, key };
        });
    };

    const sendRequest = async () => {
        const tfmKey = variables.reduce((r, k) =>
            r.replaceAll(`$${k}`, varForm[k] ?? 'undefined'), form.key);
        const result = await fetch('/api/debug/key', {
            method: 'POST',
            body: JSON.stringify({ ...form, key: tfmKey } as KeyDebugRequestDto),
        });
        const resp = await result.json();
        setResults(resp as KeyDebugResponseDto);
    };

    const renderResults = () => {
        if (!results) {
            return (<div>Send a request to see results</div>);
        }

        if (results.data === undefined) {
            return (<div>Result was undefined for key</div>);
        }

        switch (results.type) {
            case 'error':
                return (<div>There was an error: {results.error}</div>);

            case 'string': {
                try {
                    return (<div>{JSON.stringify(JSON.parse(results.data as string), null, 2)}</div>)
                } catch(err) {
                    return (<div>{results.data as string}</div>)
                }
            }

            case 'hash': {
                const hashVal = results.data as KeyDebugHashValueDto;
                const keys = Object.keys(hashVal);
                return (
                    <div className="max-w-full overflow-x-auto">
                        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                            {keys.length <= 0 && (<div className="col-span-2">No Values</div>)}
                            {
                                keys.map((k) => {
                                    return (
                                        <>
                                            <div key={`key_${k}`}>{k}</div>
                                            <div key={`val_${k}`}>{hashVal[k]}</div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                );
            }

            case 'zset': {
                const setVal = results.data as KeyDebugZMemberDto[];
                return (
                    <div className="max-w-full overflow-x-auto">
                        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                            {setVal.length <= 0 && (<div className="col-span-2">No Values</div>)}
                            {
                                setVal.map((k) => {
                                    return (
                                        <>
                                            <div key={`key_${k.member}`}>{k.member}</div>
                                            <div key={`val_${k.member}`}>{k.score}</div>
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                );
            }
        }
    };

    return (
        <>
            <div className="flex justify-between items-center border-b">
                <h1 className="text-md lg:text-2xl font-bold">Community Survey - DEBUG</h1>
                <div className="my-4 flex gap-4">
                    <button
                        className="border-2 bg-neutral-200 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 px-2 py-1 rounded-lg text-small hover:bg-neutral-300 hover:border-neutral-500 dark:hover:bg-neutral-700 dark:hover:border-neutral-500 flex gap-2 items-center cursor-pointer"
                        onClick={() => ctx.setPageContext({page: 'list'})}
                    >
                        <ArrowLeftIcon className="size-6" />
                        <div>Close</div>
                    </button>
                </div>
            </div>
            <div className="flex gap-4 my-4">
                <div className="w-3/4 flex flex-col gap-4">
                    <div className="flex gap-4">
                        <input name="key" placeholder="Key" maxLength={50} value={form.key} onChange={onInputChange} className="p-2 w-full text-2xl border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                        <select name="type" value={form.type} onChange={onInputChange} className="border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white px-2 py-1 [&_option]:dark:bg-neutral-900 [&_option]:dark:text-neutral-300">
                            <option value="get">get</option>
                        </select>
                        <button onClick={sendRequest} className="cursor-pointer p-2 border rounded-lg border-neutral-500"><ArrowUpOnSquareIcon className="size-6" /></button>
                    </div>
                    {results?.key && (<div className="text-lg font-bold py-2 border-b-1">{results.type ?? 'undefined'} - {results.key}</div>)}
                    <div className="w-full min-h-10 bg-neutral-100 dark:bg-neutral-900 font-mono whitespace-pre p-2 max-h-[500px] overflow-y-auto">
                        {renderResults()}
                    </div>
                </div>
                <div className="w-1/4 flex flex-col gap-4">
                    <div>
                        <h2 className="text-lg font-bold border-b-1">Keys</h2>
                        <ul>
                            {keys.map((k, i) =>
                                <li className="cursor-pointer hover:font-bold hover:underline" onClick={() => onKeySelect(k)} key={`key_${i}`}>{k}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold border-b-1">Variables</h2>
                        <div className="flex flex-col gap-2">
                            {variables.map((k, i) =>
                                <div className="flex flex-col gap-2" key={`var_${i}`}>
                                    {k} <input value={varForm[k] ?? ''} onChange={onVarChange} id={`var_${k}`} name={`var_${k}`} className="p-2 w-full border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" autoComplete="off" data-lpignore="true" />
                                </div>)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
