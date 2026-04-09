/*!
* Viewer for multiple choice, checkbox, and rank questions.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyQuestionDto } from '../../../../../shared/redis/SurveyDto';
import { BulletIcon, CheckboxIcon, RankIcon } from '../../../../shared/components/CustomIcons';

export interface MultiOptionViewerProps {
    question: SurveyQuestionDto;
}

export const MultiOptionViewer = (props: MultiOptionViewerProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'multi' && qType != 'checkbox' && qType != 'rank')
        throw new Error(`Unexpected question type of '${qType}' when 'multi', 'checkbox', or 'rank' was expected.`);

    const q = props.question;

    const optionIcon = () => {
        return qType === 'multi'
            ? <BulletIcon fill={false} />
            : qType === 'checkbox'
                ? <CheckboxIcon fill={false} />
                : <RankIcon />;
    }

    return (
        <ul className="flex flex-col gap-4">
            {q.options.map((o, i) => (
                <li key={`sqo_${i}`} className="flex gap-2 items-center">
                    {optionIcon()}
                    {o.label}
                </li>
            ))}
        </ul>
    );
};
