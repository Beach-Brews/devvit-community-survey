/*!
 * General types  for API communication.
 *
 * Author:  u/Beach-Brews
 * License: BSD-3-Clause
 */

export type ApiResponse<T> = {
  code: number;
  message: string;
  result: T | undefined
};

export type MessageResponse = ApiResponse<void>;

export type SurveyIdParam = {surveyId: string};
export type QuestionIdParam = {questionId: string};
