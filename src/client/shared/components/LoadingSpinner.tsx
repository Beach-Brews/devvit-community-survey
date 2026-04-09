/*!
* Animated loading spinner.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const LoadingSpinner = ({className}: {className: string}) => {
    return (
        <div className="flex items-end gap-1 h-6">
            <div className={`w-1.5 animate-bar1 rounded-sm ${className}`} />
            <div className={`w-1.5 animate-bar2 rounded-sm ${className}`} />
            <div className={`w-1.5 animate-bar3 rounded-sm ${className}`} />
        </div>
    );
};
