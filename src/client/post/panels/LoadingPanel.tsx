/*!
* The content displayed while the survey context is loading.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const LoadingPanel = () => {
    return (
        <div className="flex flex-col gap-4 justify-center items-center animate-pulse h-full text-neutral-700 dark:text-neutral-300">
            <div className="h-10 bg-neutral-300 rounded-full dark:bg-neutral-700 w-2/3"></div>
            <div className="w-full flex flex-col gap-2 justify-center items-center">
                <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-3/4"></div>
                <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/3"></div>
            </div>
            <div className="mt-8 w-full flex justify-center">
                <button className="w-2/3 max-w-[300px] bg-neutral-100 dark:bg-neutral-900 px-8 py-2 rounded-xl">
                    Loading Survey
                </button>
            </div>
            <div className="h-6 bg-neutral-300 rounded-full dark:bg-neutral-700 w-1/3"></div>
        </div>
    );
};
