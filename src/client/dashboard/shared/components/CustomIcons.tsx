/*!
* Some custom icons.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const BulletIcon = ({fill}: {fill: boolean}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" data-slot="icon" className="size-4">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
            {fill && (<circle cx="12" cy="12" r="6" fill="currentColor" stroke="none" />)}
        </svg>
    );
};

export const CheckboxIcon = ({fill} : {fill: boolean}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" data-slot="icon" className="size-4">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="3" />
            {fill && (<rect x="6" y="6" width="12" height="12" rx="2" ry="2" fill="currentColor" stroke="none" />)}
        </svg>
    );
};

export const RankIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" data-slot="icon" className="size-4">
            <rect x="3" y="2" width="18" height="4" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="2" y="9" width="20" height="5" rx="2" ry="2" fill="currentColor" stroke="none" />
            <rect x="3" y="17" width="18" height="4" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
};
