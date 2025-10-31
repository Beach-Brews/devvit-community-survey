/*!
* Displays the options a user can choose for a scale question.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { QuestionProps } from './QuestionProps';
import { BulletIcon } from '../../../shared/components/CustomIcons';

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
        items.push(<li key={`so_${i}`} onClick={() => onSelect(i)} className="text-center cursor-pointer"><BulletIcon fill={selectedValue === i} />{i}</li>);
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-[500px]">
            <div className="text-sm md:text-base flex justify-between gap-4 w-full">
                <div className="w-1/3">{question.minLabel}</div>
                <div className="w-1/3 text-center">{question.midLabel}</div>
                <div className="w-1/3 text-right">{question.maxLabel}</div>
            </div>
            <ul className="flex justify-between items-center gap-4 w-full">
                {items}
            </ul>
        </div>
    );
};
