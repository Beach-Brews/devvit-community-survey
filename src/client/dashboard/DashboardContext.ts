/*!
* Definition for the general dashboard context.
*
* Author:  u/Beach-Brews
* License: BSD-3-Clause
*/

import { createContext, Dispatch, SetStateAction } from 'react';

export type DashboardListPageContext = {
    page: 'list';
};
export type DashboardSurveyIdPageContext = {
    page: 'edit' | 'results';
    surveyId: number;
};

export type DashboardPageContext = DashboardListPageContext | DashboardSurveyIdPageContext;

export type DashboardContextProps = {
    pageContext: DashboardPageContext;
    setPageContext: Dispatch<SetStateAction<DashboardPageContext>>;
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);
