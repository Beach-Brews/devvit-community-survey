/*!
* Displays the options a user can choose for a scale question.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { QuestionProps } from './QuestionProps';
import { BulletIcon } from '../../../shared/components/CustomIcons';
import { renderMarkdown } from '../../../shared/markdown/markdownFlavor';

export const ScaleQuestion = (props: QuestionProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'scale')
        throw new Error(`Unexpected question type of '${qType}' when 'scale' was expected.`);

    // State for which option is chosen
    const question = props.question;
    const parsedValue = props.response?.[0] ? parseInt(props.response[0]) : undefined;
    const selectedValue = parsedValue && !isNaN(parsedValue) ? parsedValue : undefined;

    // Handle on change selection
    const onSelect = async (val: number) => {
        props.setResponse([val.toString()]);
    };

    // Create the items, based on the min-max
    const items = [];
    for (let i = question.min; i <= question.max; ++i) {
        items.push(<li
            key={`so_${i}`}
            onClick={() => onSelect(i)}
            className="text-center cursor-pointer group"
        >
            <div
                className={`size-6 flex items-center 
                ${selectedValue === i ? 'text-survey-primary-border' : 'group-hover:text-survey-primary-border-hovered'}
                `}
            >
                <BulletIcon fill={selectedValue === i} />
            </div>
            {i}
        </li>);
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-4 w-full max-w-125">
                <div className="text-sm md:text-base flex justify-between gap-4 w-full">
                    <div className="w-1/3">{renderMarkdown(question.minLabel)}</div>
                    <div className="w-1/3 text-center">{renderMarkdown(question.midLabel)}</div>
                    <div className="w-1/3 text-right">{renderMarkdown(question.maxLabel)}</div>
                </div>
                <ul className="flex justify-between items-center w-full">
                    {items}
                </ul>
            </div>
        </div>
    );
};
