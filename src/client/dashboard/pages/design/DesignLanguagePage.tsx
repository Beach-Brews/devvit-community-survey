/*!
* The Design Language, outlining all useful design elements, such as colors,
* forms, buttons, and notifications.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { TabGroup } from '../../../shared/components/TabGroup';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CSSProperties, useContext, useState } from 'react';
import { DashboardContext } from '../../DashboardContext';
import { DlColorTab } from './DlColorTab';
import { DlTypographyTab } from './DlTypographyTab';
import { DlButtonsTab } from './DlButtonsTab';
import { DlFormsTab } from './DlFormsTab';
import { DlTabsTab } from './DlTabsTab';

export const TempTab = () => {
    return (
        <div>
            Typography tab to show off fonts.
        </div>
    )
};

export const DesignLanguagePage = () => {
    const ctx = useContext(DashboardContext);
    if (!ctx) throw Error('Context undefined.');
    const [theme, setTheme] = useState<string>('limegreen');
    return (
        <div
            className="flex flex-col gap-4 p-4"
            style={{
                '--survey-primary-border': `var(--reddit-${theme})`,
                '--survey-primary-border-hovered': `var(--reddit-${theme}-dark)`,
                '--survey-primary-content': `var(--reddit-${theme})`,
                '--survey-button-primary-background': `var(--reddit-${theme})`,
                '--survey-button-primary-background-hovered': `var(--reddit-${theme}-secondary)`,
                '--color-survey-primary-border': `var(--reddit-${theme})`,
                '--color-survey-primary-border-hovered': `var(--reddit-${theme}-dark)`,
                '--color-survey-primary-content': `var(--reddit-${theme})`,
                '--color-survey-button-primary-background': `var(--reddit-${theme})`,
                '--color-survey-button-primary-background-hovered': `var(--reddit-${theme}-secondary)`
            } as CSSProperties}
        >
            <div className="flex justify-between">
                <button onClick={() => {ctx.setPageContext({page: 'list'})}} className="svy-btn-secondary">
                    <ArrowLeftIcon className="size-5" />
                    Back
                </button>
                <select className="text-survey-primary-content" onChange={e => setTheme(e.target?.value)}>
                    <option selected={theme === 'orangered'} value="orangered" className="text-global-black font-bold bg-reddit-orangered">Orange Red</option>
                    <option selected={theme === 'guavapink'} value="guavapink" className="text-global-black font-bold bg-reddit-guavapink">Guava Pink</option>
                    <option selected={theme === 'bananayellow'} value="bananayellow" className="text-global-black font-bold bg-reddit-bananayellow">Banana Yellow</option>
                    <option selected={theme === 'limegreen'} value="limegreen" className="text-global-black font-bold bg-reddit-limegreen">Lime Green</option>
                    <option selected={theme === 'juniperblue'} value="juniperblue" className="text-global-black font-bold bg-reddit-juniperblue">Juniper Blue</option>
                </select>
            </div>
            <TabGroup tabs={{
                'Colors': <DlColorTab />,
                'Typography': <DlTypographyTab />,
                'Buttons': <DlButtonsTab />,
                'Forms': <DlFormsTab />,
                'Tables': <TempTab />,
                'Tabs': <DlTabsTab />,
                'Tooltips': <TempTab />,
                'Alerts': <TempTab />,
                'Toasts': <TempTab />,
                'Modals': <TempTab />
            }} />
        </div>
    );
};
