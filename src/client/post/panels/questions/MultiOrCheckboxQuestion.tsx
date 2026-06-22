/*!
* Displays the options a user can choose for a multiple choice or checkbox question.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { QuestionProps } from './QuestionProps';
import { BulletIcon, CheckboxIcon } from '../../../shared/components/CustomIcons';
import { renderMarkdown } from '../../../shared/markdown/markdownFlavor';

export const MultiOrCheckboxQuestion = (props: QuestionProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'multi' && qType != 'checkbox')
        throw new Error(`Unexpected question type of '${qType}' when 'multi' or 'checkbox' was expected.`);

    // State for which option is chosen
    const options = props.question.options;
    const optionCount = options.length;
    const response = props?.response;
    const chosenValues: boolean[] = response
        ? options.map(o => response.findIndex(v => v === o.value) >= 0)
        : new Array(optionCount).fill(false);

    // Handle saving response to Redis
    const setChosenValues = (s: boolean[]) => {
        const values = s.map((v, i) => (v ? options[i]?.value : undefined))
            .filter((v) => typeof v === 'string');
        props.setResponse(values);
    };

    // Handle on change selection
    const onOptionClick = async (idx: number) => {
        switch (qType) {
            case 'multi': {
                const newState = new Array(optionCount).fill(false);
                newState[idx] = true;
                setChosenValues(newState);
                break;
            }

            case 'checkbox': {
                const newState = [...chosenValues];
                newState[idx] = !newState[idx];
                setChosenValues(newState);
                break;
            }
        }
    };

    // Choose icon based on type
    const optionIcon = (idx: number) => {
        const selected = chosenValues[idx] ?? false;
        return qType === 'multi'
            ? (<BulletIcon fill={selected} />)
            : (<CheckboxIcon fill={selected} />);
    };

    return (
        <ul className={`flex flex-col text-base gap-2`}>
            {props.question.options.map((o, i) => {
                return (
                    <li
                        key={`sqo_${o.value}`}
                        className={`p-2 cursor-pointer flex items-center gap-1 bg-neutral-background-strong group 
                        ring rounded-lg ${chosenValues[i] ? 'ring-survey-primary-border' : 'ring-neutral-border hover:ring-survey-primary-border-hovered'}
                        `}
                        onClick={() => void onOptionClick(i)}
                    >
                        <div
                            className={`size-6 flex items-center 
                            ${chosenValues[i] ? 'text-survey-primary-border' : 'group-hover:text-survey-primary-border-hovered'}
                            `}
                        >
                            {optionIcon(i)}
                        </div>
                        <div>{renderMarkdown(o.label)}</div>
                    </li>
                );
            })}
        </ul>
    );
};
