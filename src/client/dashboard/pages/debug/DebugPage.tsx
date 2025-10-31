/*!
* Debug page which provides some dangerous actions.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ArrowLeftIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';
import { useState, useContext, ChangeEvent } from 'react';
import { DashboardContext } from '../../DashboardContext';

type KeyTypes = 'get' | 'hGetAll' | 'zScan' | 'del' | 'hDel' | 'zRem' | undefined;

type KeyForm = {
    key: string;
    type: KeyTypes
}

export const DebugPage = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');

    const [form, setForm] = useState<KeyForm>({ key: '', type: 'get' });
    const [results, setResults] = useState<string>('No Results');

    const onInputChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setForm(s => {
            return {
                ...s,
                [e.target.name]: e.target.value
            };
        });
    };

    const sendRequest = async () => {
        const result = await fetch('/api/debug/key', {
            method: 'POST',
            body: JSON.stringify(form)
        });
        const txt = await result.text();
        setResults(txt);
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
            <div className="flex flex-col gap-4 my-4">
                <div className="flex gap-4">
                    <input name="key" placeholder="Key" maxLength={50} value={form.key} onChange={onInputChange} className="p-2 w-full text-2xl border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white" />
                    <select name="type" value={form.type} onChange={onInputChange} className="border rounded-lg border-neutral-500 focus:outline-1 focus:outline-black dark:focus:outline-white px-2 py-1 [&_option]:dark:bg-neutral-900 [&_option]:dark:text-neutral-300">
                        <option value="get">get</option>
                        <option value="hGetAll">hGetAll</option>
                        <option value="zScan">zScan</option>
                        <option value="del">del</option>
                        <option value="hDel">hDel</option>
                        <option value="zRem">zRem</option>
                    </select>
                    <button onClick={sendRequest} className="cursor-pointer p-2 border rounded-lg border-neutral-500"><ArrowUpOnSquareIcon className="size-6" /></button>
                </div>
                <div className="w-full min-h-10 bg-neutral-100 dark:bg-neutral-900 font-mono p-2 max-h-[500px] overflow-y-auto">
                    {results}
                </div>
            </div>
        </>
    );
}
