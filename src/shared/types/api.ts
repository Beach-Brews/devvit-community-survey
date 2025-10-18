export type ApiResponse<T> = {
  code: number;
  message: string;
  result: T | undefined
};

export type MessageResponse = ApiResponse<void>;

export type SurveyIdParam = {surveyId: string};
