/*!
* Placeholder skeleton for loading survey list.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const SurveyListCardLoading = () => {
    return (
        <div className="text-sm p-2 flex flex-col justify-between gap-2 animate-pulse text-neutral-700 dark:text-neutral-300 rounded-md bg-white shadow-md dark:bg-neutral-900 dark:shadow-neutral-800">
            <div className="px-1 flex justify-between items-center h-6">
                <div className="h-2.5 bg-neutral-300 rounded-full dark:bg-neutral-700 w-18"></div>
                <div className="flex gap-1">
                    <div className="h-4 bg-neutral-300 rounded-full dark:bg-neutral-700 w-8"></div>
                    <div className="h-4 bg-neutral-300 rounded-full dark:bg-neutral-700 w-8"></div>
                </div>
            </div>
            <div className="px-1 text-2xl text-neutral-900 dark:text-neutral-100">
                <div className="h-6 bg-neutral-400 rounded-full dark:bg-neutral-600 w-3/4 mb-4"></div>
                <div className="h-6 bg-neutral-400 rounded-full dark:bg-neutral-600 w-28"></div>
            </div>
            <div className="px-1 flex justify-between items-center min-h-6">
                <div className="h-2.5 bg-neutral-300 rounded-full dark:bg-neutral-700 w-13"></div>
                <div className="h-2.5 bg-neutral-300 rounded-full dark:bg-neutral-700 w-30"></div>
            </div>
        </div>
    );
};
