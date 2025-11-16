/*!
* Definition for the general dashboard context.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { createContext, Dispatch, SetStateAction } from 'react';
import { SurveyWithQuestionsDto } from '../../shared/redis/SurveyDto';
import { UserResponsesDto } from '../../shared/redis/ResponseDto';
import { AddToast } from '../shared/toast/toastTypes';

export enum PanelType {
    Intro,
    Question,
    Outro,
    Result,
    QuestionDescription,
    Delete
}

export type SurveyPanelContext = {
    panel: PanelType;
    number?: number;
    prev?: PanelType;
    showResultNav?: boolean;
};

export interface SurveyContextProps {
    panelContext: SurveyPanelContext;
    setPanelContext: Dispatch<SetStateAction<SurveyPanelContext>>;
    survey: SurveyWithQuestionsDto;
    lastResponse: UserResponsesDto | undefined;
    setLastResponse: Dispatch<SetStateAction<UserResponsesDto | undefined>>;
    addToast: AddToast;
}

export const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);
