/*!
* Viewer for scale questions.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyQuestionDto } from '../../../../../shared/redis/SurveyDto';
import { JSX } from 'react';
import { BulletIcon } from '../../../../shared/components/CustomIcons';

export interface ScaleViewerProps {
    question: SurveyQuestionDto;
}

export const ScaleViewer = (props: ScaleViewerProps) => {
    // Check that the option type is valid
    const qType = props.question.type;
    if (qType != 'scale')
        throw new Error(`Unexpected question type of '${qType}' when 'scale' was expected.`);

    const q = props.question;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-4 items-center">
                <div className="w-1/3">
                    {q.minLabel}
                </div>
                <div className="w-1/3 text-center">
                    {q.midLabel}
                </div>
                <div className="w-1/3 text-right">
                    {q.maxLabel}
                </div>
            </div>
            <div className="flex justify-between items-center px-8">
                {(() => {
                    const mock: JSX.Element[] = [];
                    for (let i = q.min; i <= q.max; ++i) {
                        mock.push(<div key={`rank_${i}`} className="text-center"><BulletIcon fill={false} /> {i}</div>);
                    }
                    return mock;
                })()}
            </div>
        </div>
    );
};
