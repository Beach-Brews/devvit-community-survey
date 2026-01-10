/*!
* Widget that displays the current input length + max length.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

export interface InputLengthIndicatorProps {
    current: number;
    max: number;
    warnCount?: number;
    warnPercent?: number;
    className?: string | undefined;
}

export const InputLengthIndicator = (props: InputLengthIndicatorProps) => {
    const warnLevel = props.warnCount ?? (props.warnPercent ?? 0.1) * props.max;
    let className = 'text-xs p-1 text-right bg-white dark:bg-neutral-900';
    if (props.max === props.current)
        className += ' font-bold text-red-800 dark:text-red-400';
    else if ((props.max - props.current) <= warnLevel)
        className += ' font-bold text-amber-800 dark:text-amber-400';
    if (props.className)
        className += ' ' + props.className;

    return (
        <div className={className}>{props.current} / {props.max}</div>
    );
};
