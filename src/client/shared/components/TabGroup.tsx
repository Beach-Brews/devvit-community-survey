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
    containerClassName,
    buttonClassName,
    activeButtonClassName,
    position = 'top',
    startTab = undefined,
    onChange = undefined
}: {
    tabs: T,
    containerClassName?: string | undefined,
    buttonClassName?: string | undefined,
    activeButtonClassName?: string | undefined,
    position?: 'top' | 'bottom' | 'left' | 'right',
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
    const className = (() => {
        switch (position) {
            case 'left':
                return "";
            case "right":
                return "flex-row-reverse";
            case "bottom":
                return "flex-col-reverse";
            case "top":
            default:
                return "flex-col";
        }
    })();
    return (
        <div className={`w-full flex gap-4 ${className}`}>
            <ButtonGroup
                buttons={Object.keys(tabs)}
                active={active}
                containerClassName={containerClassName}
                buttonClassName={buttonClassName}
                activeButtonClassName={activeButtonClassName}
                position={position}
                onChange={onTabChange}
            />
            {tabs[active]}
        </div>
    );
};
