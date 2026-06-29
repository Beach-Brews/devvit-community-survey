/*!
* Definition for the general dashboard context.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { createContext, Dispatch, SetStateAction } from 'react';
import { SurveyWithQuestionsDto } from '../../shared/redis/SurveyDto';
import { UserResponsesDto } from '../../shared/redis/ResponseDto';
import { AddToast, RemoveToast, Toast } from '../shared/toast/toastTypes';
import { SubredditInfoDto, UserInfoDto } from '../../shared/types/postApi';

export enum PanelType {
    Intro,
    Question,
    Outro,
    Result,
    QuestionDescription,
    Help,
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
    user: UserInfoDto | null | undefined;
    subInfo: SubredditInfoDto | null | undefined;
    lastResponse: UserResponsesDto | null | undefined;
    setLastResponse: Dispatch<SetStateAction<UserResponsesDto | null | undefined>>;
    toasts: Toast[];
    addToast: AddToast;
    removeToast: RemoveToast;
    canViewResults: boolean;
    anonymousMode: boolean;
    setAnonymousMode: Dispatch<SetStateAction<boolean>>;
    expandedMode: boolean;
    setExpandedMode: Dispatch<SetStateAction<boolean>>;
}

export const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);
