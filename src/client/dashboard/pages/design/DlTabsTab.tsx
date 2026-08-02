/*!
* The tab for displaying the tab types in the Design Language.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { TabGroup } from '../../../shared/components/TabGroup';

export const DlTabsTab = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1>Tabs</h1>
            <h2>Top</h2>
            <div className="p-4 rounded-lg border border-neutral-border">
                <TabGroup containerClassName="justify-center" tabs={{
                    'One': (<div>Tab One</div>),
                    'Two': (<div>Tab Two</div>),
                    'Three': (<div>Tab Three</div>),
                }} />
            </div>
            <h2>Bottom</h2>
            <div className="p-4 rounded-lg border border-neutral-border">
                <TabGroup containerClassName="justify-center" position="bottom" tabs={{
                    'One': (<div>Tab One</div>),
                    'Two': (<div>Tab Two</div>),
                    'Three': (<div>Tab Three</div>),
                }} />
            </div>
            <h2>Left</h2>
            <div className="p-4 rounded-lg border border-neutral-border">
                <TabGroup containerClassName="justify-center" position="left" tabs={{
                    'One': (<div>Tab One</div>),
                    'Two': (<div>Tab Two</div>),
                    'Three': (<div>Tab Three</div>),
                }} />
            </div>
            <h2>Right</h2>
            <div className="p-4 rounded-lg border border-neutral-border">
                <TabGroup containerClassName="justify-center" position="right" tabs={{
                    'One': (<div>Tab One</div>),
                    'Two': (<div>Tab Two</div>),
                    'Three': (<div>Tab Three</div>),
                }} />
            </div>
        </div>
    );
};
