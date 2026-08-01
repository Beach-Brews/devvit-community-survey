/*!
* A component that given multiple tabs, displays an active content zone and
* utilizing a ButtonGroup to navigate the tabs.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { ReactNode, useCallback, useState } from 'react';
import { ButtonGroup } from './ButtonGroup';

export const TabGroup = <T extends Record<string, ReactNode>>({
    tabs,
    startTab = undefined,
    onChange = undefined
}: {
    tabs: T,
    startTab?: keyof T | undefined,
    onChange?: ((t: keyof T) => void) | undefined
}) => {
    const [active, setActive] = useState<string>(() => startTab as string || Object.keys(tabs)[0]!);
    const onTabChange = useCallback((t: string) => {
        if (onChange) {
            onChange(t);
        }
        setActive(t);
    }, [onChange, setActive]);
    return (
        <div className="w-full flex flex-col gap-4">
            <ButtonGroup buttons={Object.keys(tabs)} active={active} onChange={onTabChange} />
            {tabs[active]}
        </div>
    );
};
