/*!
* A component that displays multiple buttons in a single row.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export const ButtonGroup = ({
    buttons,
    active,
    containerClassName,
    buttonClassName,
    activeButtonClassName,
    position = 'top',
    onChange
}: {
    buttons: string[],
    active: string,
    containerClassName?: string | undefined,
    buttonClassName?: string | undefined,
    activeButtonClassName?: string | undefined,
    position?: 'top' | 'bottom' | 'left' | 'right',
    onChange: (b: string) => void
}) => {
    const [containerClass, buttonClass, activeButtonClass] = (() => {
        switch (position) {
            case 'left':
                return [
                    "flex-col overflow-y-auto px-2",
                    "hover:border-r-3 border-r-survey-button-primary-background",
                    "border-r-3"
                ];
            case 'right':
                return [
                    "flex-col overflow-y-auto px-2",
                    "hover:border-l-3 border-l-survey-button-primary-background",
                    "border-l-3"
                ];
            case 'bottom':
                return [
                    "w-full overflow-x-auto py-2",
                    "hover:border-t-3 border-t-survey-button-primary-background",
                    "border-t-3"
                ];
            case 'top':
            default:
                return [
                    "w-full overflow-x-auto py-2",
                    "hover:border-b-3 border-b-survey-button-primary-background",
                    "border-b-3"
                ];
        }
    })();
    return (
        <div className={`flex gap-2 ${containerClassName} ${containerClass}`}>
            {buttons.map(b => (
                <button
                    key={b}
                    onClick={() => onChange(b)}
                    className={`
                    min-w-22 cursor-pointer flex justify-center px-2 py-1 box-border duration-300 
                    ${buttonClassName} ${buttonClass} ${b === active && `${activeButtonClassName} ${activeButtonClass}`}
                    `}
                >
                    {b}
                </button>
            ))}
        </div>
    );
};
