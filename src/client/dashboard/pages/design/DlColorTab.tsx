/*!
* The color tab for the Design Language.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { CSSProperties, MouseEvent } from 'react';

export const DlColorItem = ({color}: {color: string}) => {
    const value = window.getComputedStyle(document.documentElement)
        ?.getPropertyValue(`--${color}`).trim();
    const copyStyle = async (e: MouseEvent<HTMLDivElement>) => {
        await navigator.clipboard.writeText(e.ctrlKey ? value : color);
    };
    return (
        <div className="w-full border border-neutral-border rounded-lg cursor-pointer" onClick={copyStyle}>
            <div
                style={{ '--dl-color-item': `var(--${color})` } as CSSProperties}
                className={`w-full h-18 rounded-t-lg bg-(--dl-color-item)`}
            ></div>
            <div className="flex flex-col gap-2 p-2 justify-between">
                <span>{color}</span>
                <span className="text-neutral-content-weak">{value}</span>
            </div>
        </div>
    );
};

export const DlColorTab = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1>Colors</h1>
            <h2>Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-6 justify-between gap-4">
                <DlColorItem color="neutral-content-strong" />
                <DlColorItem color="neutral-content" />
                <DlColorItem color="neutral-content-weak" />
                <DlColorItem color="neutral-background-strong" />
                <DlColorItem color="neutral-background" />
                <DlColorItem color="neutral-background-weak" />
                <DlColorItem color="neutral-background-hovered" />
                <DlColorItem color="neutral-background-selected" />
                <DlColorItem color="neutral-background-pinned" />
                <DlColorItem color="neutral-background-container" />
                <DlColorItem color="neutral-border-strong" />
                <DlColorItem color="neutral-border-medium" />
                <DlColorItem color="neutral-border" />
                <DlColorItem color="neutral-border-weak" />
            </div>
            <h2>Reddit</h2>
            <div className="grid grid-cols-1 md:grid-cols-6 justify-between gap-4">
                <DlColorItem color="reddit-orangered" />
                <DlColorItem color="reddit-orangered-secondary" />
                <DlColorItem color="reddit-orangered-light" />
                <DlColorItem color="reddit-guavapink" />
                <DlColorItem color="reddit-guavapink-secondary" />
                <DlColorItem color="reddit-guavapink-light" />
                <DlColorItem color="reddit-bananayellow" />
                <DlColorItem color="reddit-bananayellow-secondary" />
                <DlColorItem color="reddit-bananayellow-light" />
                <DlColorItem color="reddit-limegreen" />
                <DlColorItem color="reddit-limegreen-secondary" />
                <DlColorItem color="reddit-limegreen-light" />
                <DlColorItem color="reddit-juniperblue" />
                <DlColorItem color="reddit-juniperblue-secondary" />
                <DlColorItem color="reddit-juniperblue-light" />
                <DlColorItem color="devvit-expanded-header" />
            </div>
        </div>
    );
};
