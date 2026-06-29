/*!
* The content displayed while the survey context is loading.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { LoadingSpinner } from '../../shared/components/LoadingSpinner';

export const LoadingPanel = () => {
    return (
        <div className="flex flex-col gap-2 justify-center items-center h-full">
            <LoadingSpinner className="bg-neutral-content-weak" />
            <div className="text-xl text-center">Loading Survey...</div>
        </div>
    );
};
