/*!
* Displays help text for the intro panel.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const IntroHelp = () => {
    return (
        <div className="h-full">
            <h1>Welcome to Community Survey!</h1>
            <p>This app allows you to respond to surveys directly inside Reddit!</p>
            {(() => { let res = []; for (let i=0; i<150; ++i) { res.push(<p>More Content</p>); } return res; })()}
        </div>
    );
};
