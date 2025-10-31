﻿/*!
* Definition for the general dashboard context.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { createContext, Dispatch, SetStateAction } from 'react';
import { SurveyWithQuestionsDto } from '../../shared/redis/SurveyDto';

export enum PanelType {
    Intro,
    Question,
    Outro
}

export type SurveyPanelContext = {
    panel: PanelType;
    number?: number;
};

export interface SurveyContextProps {
    panelContext: SurveyPanelContext;
    setPanelContext: Dispatch<SetStateAction<SurveyPanelContext>>;
    survey: SurveyWithQuestionsDto;
}

export const SurveyContext = createContext<SurveyContextProps | undefined>(undefined);
