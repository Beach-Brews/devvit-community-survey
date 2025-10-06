/*!
* Type definitions for common props for question editors.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyQuestionDto } from '../../../../../shared/redis/SurveyDto';

export interface CommonQuestionEditorProps {
    question: SurveyQuestionDto;
    modifyQuestion: (question: SurveyQuestionDto, action?: 'up' | 'down' | 'delete') => void;
    isFirst: boolean;
    isLast: boolean;
    duplicateAction: ((q?: SurveyQuestionDto) => void) | undefined;
}
