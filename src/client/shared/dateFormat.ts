/*!
* Helper to format dates. Likely switch to a library in the future.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const formatDateTime = (date: Date | number | null) => {
    if (!date) return '';
    const d = typeof date == 'number' ? new Date(date) : date;
    return d.toLocaleString();
};

export const formatDate = (date: Date | number | null) => {
    if (!date) return '';
    const d = typeof date == 'number' ? new Date(date) : date;
    return d.toLocaleDateString();
};

export const formatTime = (date: Date | number | null) => {
    if (!date) return '';
    const d = typeof date == 'number' ? new Date(date) : date;
    return d.toLocaleTimeString();
};
