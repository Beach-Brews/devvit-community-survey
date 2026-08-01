/*!
* The buttons tab for the Design Language.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const DlButtonsTab = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1>Buttons</h1>
            <h2>Primary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 justify-between items-center">
                <div className="flex justify-center"><button className="svy-btn-primary">Primary Button</button></div>
                <div className="flex justify-center"><button disabled={true} className="svy-btn-primary">Primary Disabled</button></div>
                <div className="flex justify-center"><button className="svy-btn-primary svy-btn-lg">Primary Button</button></div>
                <div className="flex justify-center"><button className="svy-btn-primary svy-btn-sm">Primary Button</button></div>
            </div>
            <h2>Secondary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 justify-between items-center">
                <div className="flex justify-center"><button className="svy-btn-secondary">Secondary Button</button></div>
                <div className="flex justify-center"><button disabled={true} className="svy-btn-secondary">Secondary Disabled</button></div>
                <div className="flex justify-center"><button className="svy-btn-secondary svy-btn-lg">Secondary Button</button></div>
                <div className="flex justify-center"><button className="svy-btn-secondary svy-btn-sm">Secondary Button</button></div>
            </div>
        </div>
    );
};
