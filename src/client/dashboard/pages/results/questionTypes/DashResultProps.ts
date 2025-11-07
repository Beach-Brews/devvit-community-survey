/*!
* Defines common props for all result components.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { QuestionResponseDto } from '../../../../../shared/redis/ResponseDto';
import { SurveyQuestionDto } from '../../../../../shared/redis/SurveyDto';

export interface DashResultProps {
    question: SurveyQuestionDto;
    response: QuestionResponseDto;
}
