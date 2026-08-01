/*!
* A component that displays multiple buttons in a single row.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const ButtonGroup = ({
    buttons,
    active,
    onChange
}: {
    buttons: string[],
    active: string,
    onChange: (b: string) => void
}) => {
    return (
        <div className="w-full flex gap-2 overflow-x-auto py-2">
            {buttons.map(b => (
                <button
                    key={b}
                    onClick={() => onChange(b)}
                    className={`
                    min-w-22 cursor-pointer flex justify-center px-2 py-1 box-border duration-300 
                    hover:border-b-3 border-b-survey-button-primary-background ${b === active && 'border-b-3'}
                    `}
                >
                    {b}
                </button>
            ))}
        </div>
    );
};
