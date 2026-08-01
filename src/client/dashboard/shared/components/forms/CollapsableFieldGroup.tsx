/*!
 * A helper component for containing fields in a collapsable group.
 *
 * Author: u/Beach-Brews
 * License: BSD-3-Clause
 */

import React, { useState } from 'react';

export type CollapsableFieldGroupProps = {
    label: string;
    expand?: boolean;
    children: React.ReactNode
};

export const CollapsableFieldGroup = ({
    label,
    expand: initialExpand = true,
    children
}: CollapsableFieldGroupProps) => {
    const [expand, setExpand] = useState<boolean>(() => initialExpand);
    return (
        <div className="border rounded-xl border-neutral-300 dark:border-neutral-600">
            <div className={`p-2 select-none cursor-pointer flex justify-between items-center ${expand && 'border-b border-neutral-300 dark:border-neutral-600'}`} onClick={() => setExpand(e => !e)}>
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs">{expand ? '\u25B2' : '\u25BC'}</div>
            </div>
            {/*
            NOTE/TODO: Decided to use hidden instead of conditionally rendering the <div> due to the local zustand and
            state for the form components. Larger groups likely had slow rendering, and closing the group before the
            debounce triggered to save value causes lost data.
            */}
            <div className={`flex flex-col p-2 gap-2 ${expand ? '' : 'hidden'}`}>
                {children}
            </div>
        </div>
    );
};
