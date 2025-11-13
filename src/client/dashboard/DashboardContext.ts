/*!
* Definition for the general dashboard context.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { createContext, Dispatch, ReactElement, SetStateAction } from 'react';
import { UserInfoDto } from '../../shared/types/postApi';

export type DashboardListPageContext = {
    page: 'list' | 'debug';
};
export type DashboardSurveyIdPageContext = {
    page: 'edit' | 'results';
    surveyId: string | null;
};

export type DashboardPageContext = DashboardListPageContext | DashboardSurveyIdPageContext;

export type DashboardModalContent = ReactElement | undefined;

export interface DashboardContextProps {
    pageContext: DashboardPageContext;
    setPageContext: Dispatch<SetStateAction<DashboardPageContext>>;
    modal: DashboardModalContent;
    setModal: Dispatch<SetStateAction<DashboardModalContent>>;
    userInfo: UserInfoDto;
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);
