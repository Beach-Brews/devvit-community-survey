/*!
* Some custom icons.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const BulletIcon = ({fill}: {fill: boolean}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" data-slot="icon" className="size-5">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="12" cy="12" r="6" className={fill ? 'text-current group-hover:text-neutral-600 dark:group-hover:text-neutral-400' : 'hidden group-hover:block text-neutral-500'} fill="currentColor" stroke="none" />
        </svg>
    );
};

export const CheckboxIcon = ({fill} : {fill: boolean}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" data-slot="icon" className="size-5">
            <rect x="2" y="2" width="20" height="20" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="3" />
            <rect x="6" y="6" width="12" height="12" rx="2" ry="2" className={fill ? 'text-current group-hover:text-neutral-600 dark:group-hover:text-neutral-400' : 'hidden group-hover:block text-neutral-500'} fill="currentColor" stroke="none" />
        </svg>
    );
};

export const RankIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" data-slot="icon" className="size-5">
            <rect x="3" y="2" width="18" height="4" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="2" y="9" width="20" height="5" rx="2" ry="2" fill="currentColor" stroke="none" />
            <rect x="3" y="17" width="18" height="4" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
};

export const SubDefaultIcon = () => {
    return (
        <svg fill="currentColor" height="32" icon-name="community-fill" viewBox="0 0 20 20" width="32" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.977 13.79h-1.955l4.549-10.715a.81.81 0 00-.381-1.032C12.447 1.12 10.37.747 8.179 1.18c-3.612.716-6.471 3.68-7.059 7.316a9.01 9.01 0 0010.409 10.377c3.735-.616 6.741-3.635 7.347-7.371.453-2.8-.388-5.405-2.017-7.322a.505.505 0 00-.853.119l-4.029 9.49zM9.98 8.118a1.752 1.752 0 00-1.148.167 1.664 1.664 0 00-.651.596 1.703 1.703 0 00-.258.948v3.96H5.998V6.322h1.876v1.074h.035c.251-.344.567-.628.948-.851a2.55 2.55 0 011.311-.335c.172 0 .335.014.488.042.153.028.267.058.342.09l-.774 1.849a.766.766 0 00-.244-.073z"></path>
        </svg>
    );
};
