/*!
* Defines the props for a question component.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyQuestionDto } from '../../../../shared/redis/SurveyDto';
import { Dispatch, SetStateAction } from 'react';

export interface QuestionProps {
    question: SurveyQuestionDto;
    setValidResponse: Dispatch<SetStateAction<boolean>>;
}
