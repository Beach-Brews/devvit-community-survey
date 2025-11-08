/*!
* Common props for the question result components.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { SurveyQuestionDto } from '../../../../shared/redis/SurveyDto';
import { QuestionResponseDto } from '../../../../shared/redis/ResponseDto';

export interface PostResultProps {
    question: SurveyQuestionDto;
    response: QuestionResponseDto;
}
