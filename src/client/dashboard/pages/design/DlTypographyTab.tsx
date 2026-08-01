/*!
* The typography tab for the Design Language, outlining heading, text, and list styles.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const DlTypographyTab = () => {
    return (
        <div className="flex flex-col gap-4">
            <h1>Typography</h1>
            <h2>Headings</h2>
            <div className="flex flex-col gap-2">
                <h1>H1 - Extra Extra Large Text</h1>
                <h2>H2 - Extra Large Text</h2>
                <h3>H3 - Large Text</h3>
                <h4>H4 - Base Text</h4>
                <h5>H5 - Base Text</h5>
                <h6>H6 - Base Text</h6>
            </div>
            <h2>Links</h2>
            <div className="flex flex-col gap-2">
                <a href="#">Test Link</a>
            </div>
            <h2>Lists</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-2">
                <div>
                    <ul>
                        <li>One</li>
                        <li>Two</li>
                        <li>Three<ul><li>Sub One</li><li>Sub Two</li></ul></li>
                        <li>Four</li>
                        <li>Five</li>
                    </ul>
                </div>
                <div>
                    <ol>
                        <li>One</li>
                        <li>Two</li>
                        <li>Three<ol><li>Sub One</li><li>Sub Two</li></ol></li>
                        <li>Four</li>
                        <li>Five</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};
