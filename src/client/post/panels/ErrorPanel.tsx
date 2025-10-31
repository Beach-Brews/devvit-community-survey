/*!
* The content displayed if there is an error loading the survey context.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const ErrorPanel = () => {
    return (
        <div className="flex flex-col gap-4 justify-center items-center h-full">
            <img className="w-1/2" src="snoo-facepalm.png" alt="Snoo Error" />
            <div className="text-xl text-center">Sorry, there was an error loading the survey. Please try again later.</div>
        </div>
    );
};
