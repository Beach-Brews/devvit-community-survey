/*!
* Definition for the general dashboard context.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { createContext, Dispatch, ReactElement, SetStateAction } from 'react';

export type DashboardListPageContext = {
    page: 'list';
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
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);
