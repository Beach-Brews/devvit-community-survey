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

export interface DashboardModalContextProps {
    title: string;
    content: ReactElement | ReactElement[];
    disableClose?: boolean;
}

export type DashboardModalContext = DashboardModalContextProps | undefined;

export interface DashboardContextProps {
    pageContext: DashboardPageContext;
    setPageContext: Dispatch<SetStateAction<DashboardPageContext>>;
    modalContext: DashboardModalContext;
    setModalContext: Dispatch<SetStateAction<DashboardModalContext>>;
}

export const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);
